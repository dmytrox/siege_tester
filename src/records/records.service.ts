import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Records } from '../database/entities/Records.entity';
import { Cache } from 'cache-manager';
import { faker } from '@faker-js/faker';

interface Record {
    id: number,
    name: string,
    tag: string,
    description: string
}

interface XFetch {
    delta: number,
    expire: number,
    records: Array<Record>
}

@Injectable()
export class RecordsService {

    private KEY = "records";

    private KEY_XFETCH = "records_xfetch";

    private BETA = 1;

    private TTL = 30;

    constructor (@InjectRepository(Records) private readonly RecordRepository, @Inject(CACHE_MANAGER) private cacheManager: Cache) {

    }

    async getAllCache(): Promise<any>
    {
        let records: Array<Record> = await this.cacheManager.get(this.KEY);

        if(!records){
            records = await this.RecordRepository.find();    
            this.cacheManager.set(this.KEY, records, {ttl: this.TTL});
        }
                
        return records.slice(0, 100);
    }

    /**
      * Probabilistic early expiration
      *    
      * function x-fetch(key, ttl, beta=1) {
      *     value, delta, expiry ← cache_read(key)
      *     if (!value || (time() - delta * beta * log(rand(0,1)) ≥ expiry) {
      *         start ← time()
      *         value ← recompute_value()
      *         delta ← time() – start
      *         cache_write(key, (value, delta), ttl)
      *     }
      *     return value
      * }
     */
    async getAllXFetch(): Promise<any> 
    {
        const cache: XFetch = await this.cacheManager.get(this.KEY_XFETCH);
 
        let delta = cache?.delta;
        let expire = cache?.expire;
        let records =  cache?.records;
        
        if (!records || this.getCurrentTimeInSeconds() - delta * this.BETA * Math.log(Math.floor(Math.random() * 2)) >= expire){
            let start = this.getCurrentTimeInSeconds();        
            records = await this.RecordRepository.find();   
            delta = this.getCurrentTimeInSeconds() - start;            
            console.log(start, this.getCurrentTimeInSeconds());            
            expire = this.getCurrentTimeInSeconds() + this.TTL;
            this.cacheManager.set(this.KEY_XFETCH, {delta, expire, records}, {ttl: this.TTL});
            console.log("shiit")
        }

        return records.slice(0, 100);
    }

    async createDummyRecords(){
        const records = [];

        Array.from({ length: 100000 }).forEach(() => {
            records.push({
                name: faker.datatype.uuid(),
                tag: faker.datatype.uuid(),
                description: faker.datatype.uuid()
            });
        });

        
        this.RecordRepository.insert(records)
    }

    /**
     * Sheete functions block (I hate js)
     */
    getCurrentTimeInSeconds(){
        return Math.round(Date.now() / 1000)
    }  
    /**
     * 
     */
}
