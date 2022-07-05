### To run the app type this command in your terminal

```
docker run -p 6379:6379 --name redis-redisjson redislabs/rejson:latest

npm i 

npm run start:dev

```

To fill db with dummy data make request to this endpoint http://localhost:3000/create/many

### Tests

With default cache

```
siege -d1 -b -t60s -c10 -f ./siege/siege_cache.txt
```

Concurrency | #10 | #25 | #50 | #100  
--- | --- | --- | --- |---
Availability | 100 | 100 | 100 | 100 
Average response time | 1.78 | 3.15 | 6.97 | 13.79
Throughput | 0.08 | 0.11 | 0.09 | 0.09

```
siege -d1 -b -t60s -c10 -f ./siege/siege_xfetch.txt
```
With X-Fetch function cache
Concurrency | #10 | #25 | #50 | #100  
--- | --- | --- | --- |---
Availability | 100 | 100 | 100 | 100 
Average response time  | 1.41 | 3.17 | 5.89 | 8.74
Throughput | 0.10 | 0.08 | 0.08 | 0.02
