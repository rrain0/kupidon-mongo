@file:Repository("https://jcenter.bintray.com")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
//@file:Import("shell.main.kts")

import kotlinx.coroutines.*
import java.util.concurrent.Executors




runBlocking(Executors.newCachedThreadPool().asCoroutineDispatcher()) {
  
  val mongoHost = env("MONGO_HOSTNAME")
  val mongoPort = env("MONGO_PORT")
  val mongoRs = env("MONGO_RS")
  
  val mongod = "mongod --port $mongoPort --replSet $mongoRs --bind_ip_all --ipv6"
  
  val mongosh = "mongosh --host $mongoHost --port $mongoPort"
  
  /*Path.of("/data/configmongo").let {
    if (!Files.exists(it)) Files.createDirectory(it)
  }*/
  
  // Prepare mongo keyfile - it must be same for all replica set members
  println("INFO mongo-start.main.kts: Preparing mongo keyfile...")
  shellWait("""
    mkdir /data/configmongo
    cp /data/configdb/mongoKeyFile /data/configmongo/mongoKeyFile
    chmod 400 /data/configmongo/mongoKeyFile
    chown 999:999 /data/configmongo/mongoKeyFile
  """.trimIndent())
  
  println("INFO mongo-start.main.kts: Starting mongod to config it...")
  shell(mongod)
  
  
  withRetry {
    println("INFO mongo-start.main.kts: Starting setup replica set...")
    shellWait("$mongosh --file /data/configdb/01-rs-init.js")
  }
  
  println("INFO mongo-start.main.kts: Creating admin user...")
  shellWait("$mongosh --file /data/configdb/02-rs-create-admin-user.js")
  
  println("INFO mongo-start.main.kts: Starting shutdown mongod with replica set")
  shellWait("$mongosh --file /data/configdb/03-rs-shutdown.js")
  
  launch {
    // retry to wait for port to be free
    withRetry {
      println("INFO mongo-start.main.kts: Start mongo with replica set with auth enabled...")
      shellWait("$mongod --auth --keyFile /data/configmongo/mongoKeyFile")
    }
  }
  
  withRetry {
    println("INFO mongo-start.main.kts: Creating app db and app db admin...")
    shellWait("$mongosh --file /data/configdb/04-app-create-db-and-admin.js")
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
      if (i >= 1) println("INFO mongo-start.main.kts: Retry attempt #$i")
      block()
      break
    }
    catch (ex: Exception) {
      if (i == retries) throw ex
    }
    delay(interval)
  }
}



fun exec(vararg args: String) {
  ProcessBuilder(args.toList()).inheritIO().start()
}
fun shell(vararg args: String) = exec("/bin/bash", "-c", *args)



fun execWait(vararg args: String) {
  ProcessBuilder(args.toList()).inheritIO().start().waitFor().let { exitValue ->
    if (exitValue != 0) throw RuntimeException("ERROR! Exit value: $exitValue")
  }
}
fun shellWait(vararg args: String) = execWait("/bin/bash", "-c", *args)



fun sleepForever() = execWait("/bin/bash", "-c", "sleep infinity")



