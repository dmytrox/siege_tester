import { Controller, Get, Param, Post,  } from '@nestjs/common';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
    constructor (private readonly recordService: RecordsService) {}

    @Get("/")
    async getFromCache(){    
        return this.recordService.getAllCache();
    }

    @Get("/x-fetch")
    async getFromXfetch(){    
        return this.recordService.getAllXFetch();
    }

    @Post("/create/many")
    async createMany(){
        await this.recordService.createDummyRecords();
        return {status: "items created"};
    }
}
