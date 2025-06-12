@file:Repository("https://jcenter.bintray.com")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.2")
//@file:Import("shell.main.kts")

import kotlinx.coroutines.*
import java.util.concurrent.Executors




runBlocking(Executors.newCachedThreadPool().asCoroutineDispatcher()) {
  
  
  try {
    
    val mongoHost = env("MONGO_HOSTNAME")
    val mongoPort = env("MONGO_PORT")
    val mongoRs = env("MONGO_RS")
    
    
    
    
    
    
    
    // Start this mongo node with no auth to configure:
    // Port (--port <port>).
    // Replica set name (--replSet <name>).
    // ////Allow connections only from localhost (--bind_ip localhost).
    // Enable ipv6 support for ips of bindIp option (--ipv6).
    val mongodForConfig = "mongod --port $mongoPort --replSet $mongoRs --bind_ip_all --ipv6"
    
    val mongoshForConfig = "mongosh --host $mongoHost --port $mongoPort"
    
    
    println("mongo-start.main.kts --INFO-- Starting mongod to config it...")
    shellAsync(mongodForConfig)
    
    
    withRetry {
      println("mongo-start.main.kts --INFO-- Starting setup replica set...")
      shellWait("$mongoshForConfig --file /data/configdb-scripts/01-rs-init.js")
    }
    
    println("mongo-start.main.kts --INFO-- Creating admin user...")
    shellWait("$mongoshForConfig --file /data/configdb-scripts/02-rs-create-admin-user.js")
    
    
    println("mongo-start.main.kts --INFO-- Starting shutdown mongod with replica set")
    shellWait("$mongoshForConfig --file /data/configdb-scripts/03-rs-shutdown.js")
    
    
    
    // Prepare certificate files
    // Prepare mongo keyfile - it must be same for all replica set members
    println("mongo-start.main.kts --INFO-- Preparing mongo certs...")
    shellWait("""
      mkdir /data/configdb-temp-certs
      cp /data/configdb-certs/mongo-ca.pem.crt /data/configdb-temp-certs/mongo-ca.pem.crt
      cp /data/configdb-certs/mongo1.pem /data/configdb-temp-certs/mongo1.pem
      cp /data/configdb-certs/mongoAdminClient.pem /data/configdb-temp-certs/mongoAdminClient.pem
      chmod 400 /data/configdb-temp-certs/mongo-ca.pem.crt
      chmod 400 /data/configdb-temp-certs/mongo1.pem
      chmod 400 /data/configdb-temp-certs/mongoAdminClient.pem
      chown 999:999 /data/configdb-temp-certs/mongo-ca.pem.crt
      chown 999:999 /data/configdb-temp-certs/mongo1.pem
      chown 999:999 /data/configdb-temp-certs/mongoAdminClient.pem
    """.trimIndent())
    
    
    
    // Start this mongo node with full certificate auth:
    // Port (--port <port>).
    // Replica set name (--replSet <name>).
    // Path to db (--dbpath <data>).
    // Allow connections from any ip (--bind_ip_all).
    // Enable ipv6 support for ips of bindIp option (--ipv6).
    // Enable tls mode (--tlsMode requireSSL).
    // The .pem file that contains the X.509 certificate + key file
    // for membership authentication for the cluster or replica set. (--tlsClusterFile <path>).
    // Path to root CA PEM file (--tlsCAFile path).
    val mongod = "mongod --port $mongoPort --replSet $mongoRs" +
      " --dbpath /data/db" +
      " --bind_ip_all --ipv6" +
      " --tlsMode requireTLS" +
      " --clusterAuthMode x509" +
      " --tlsCertificateKeyFile /data/configdb-temp-certs/mongo1.pem" +
      " --tlsCAFile /data/configdb-temp-certs/mongo-ca.pem.crt"
    
    val mongosh = "mongosh --host $mongoHost --port $mongoPort" +
      " --tls" +
      " --tlsCertificateKeyFile /data/configdb-temp-certs/mongoAdminClient.pem" +
      " --tlsCAFile /data/configdb-temp-certs/mongo-ca.pem.crt" +
      " --authenticationDatabase '${'$'}external'" +
      " --authenticationMechanism MONGODB-X509"
    
    launch {
      // retry to wait for port to be free
      withRetry {
        println("mongo-start.main.kts --INFO-- Start mongo with replica set with auth enabled...")
        shellWait(mongod)
      }
    }
    
    withRetry {
      println("mongo-start.main.kts --INFO-- Creating app db and app db admin...")
      shellWait("$mongosh --file /data/configdb-scripts/04-app-create-db-and-admin.js")
    }
    
  }
  catch (ex: Exception) {
    ex.printStackTrace()
    sleepForever()
  }
}




fun env(name: String): String = System.getenv(name) ?: ""


suspend inline fun withRetry(
  delay: Long = 1500,
  interval: Long = 2000,
  retries: Int = 30,
  block: () -> Unit,
) {
  delay(delay)
  // from 0 because first attempt is not retry
  for (i in 0..retries){
    try {
      if (i >= 1) println("mongo-start.main.kts --INFO-- Retry attempt #$i")
      block()
      break
    }
    catch (ex: Exception) {
      if (i == retries) throw ex
    }
    delay(interval)
  }
}



fun execAsync(vararg args: String) {
  ProcessBuilder(args.toList()).inheritIO().start()
}
fun shellAsync(vararg args: String) = execAsync("/bin/bash", "-c", *args)



fun execWait(vararg args: String) {
  ProcessBuilder(args.toList()).inheritIO().start().waitFor().let { exitValue ->
    if (exitValue != 0) throw RuntimeException("ERROR! Exit value: $exitValue")
  }
}
fun shellWait(vararg args: String) = execWait("/bin/bash", "-c", *args)



fun sleepForever() = execWait("/bin/bash", "-c", "sleep infinity")



