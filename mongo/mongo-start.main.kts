@file:Repository("https://jcenter.bintray.com")
@file:DependsOn("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
//@file:Import("shell.main.kts")

import kotlinx.coroutines.*
import java.util.concurrent.Executors




runBlocking(Executors.newCachedThreadPool().asCoroutineDispatcher()) {
  
  val mongoHost = System.getenv("MONGO_HOSTNAME")
  val mongoPort = System.getenv("MONGO_PORT")
  val mongoRs = System.getenv("MONGO_RS")
  
  val mongod = "mongod --port $mongoPort --replSet $mongoRs --bind_ip_all --ipv6"
  
  val mongosh = "mongosh --host $mongoHost --port $mongoPort"
  
  /*Path.of("/data/configmongo").let {
    if (!Files.exists(it)) Files.createDirectory(it)
  }*/
  
  // Prepare mongo keyfile - it must be same for all replica set members
  println("mongo-start.main.kts: INFO: Preparing mongo keyfile...")
  shellWait("""
    mkdir /data/configmongo
    cp /data/configdb/mongoKeyFile /data/configmongo/mongoKeyFile
    chmod 400 /data/configmongo/mongoKeyFile
    chown 999:999 /data/configmongo/mongoKeyFile
  """.trimIndent())
  
  println("mongo-start.main.kts: INFO: Starting mongod to config it...")
  shell(mongod)
  
  
  retry {
    println("mongo-start.main.kts: INFO: Starting setup replica set...")
    shellWait("$mongosh --file /data/configdb/01-rs-init.js")
  }
  
  println("mongo-start.main.kts: INFO: Creating admin user...")
  shellWait("$mongosh --file /data/configdb/02-rs-create-admin-user.js")
  
  println("mongo-start.main.kts: INFO: Starting shutdown mongod with replica set")
  shellWait("$mongosh --file /data/configdb/03-rs-shutdown.js")
  
  launch {
    // retry to wait for port to be free
    retry {
      println("mongo-start.main.kts: INFO: Start mongo with replica set with auth enabled...")
      shellWait("$mongod --auth --keyFile /data/configmongo/mongoKeyFile")
    }
  }
  
  retry {
    println("mongo-start.main.kts: INFO: Creating app db and app db admin...")
    shellWait("$mongosh --file /data/configdb/04-app-create-db-and-admin.js")
  }
}





suspend inline fun retry(
  delay: Long = 1500,
  interval: Long = 2000,
  retries: Int = 30,
  block: ()->Unit
) {
  delay(delay)
  // from 0 because first attempt is not retry
  for (i in 0..retries){
    try {
      if (i>=1) println("mongo-start.main.kts: INFO: Retry attempt #$i")
      block()
      break
    }
    catch (ex: Exception){
      if (i==retries) throw ex
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
    if (exitValue!=0) throw RuntimeException("ERROR! Exit value: $exitValue")
  }
}
fun shellWait(vararg args: String) = execWait("/bin/bash", "-c", *args)



fun sleepInfinity() = execWait("/bin/bash", "-c", "sleep infinity")



