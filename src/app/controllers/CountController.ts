import { Request, Response } from "express";
import { getRepository } from "typeorm";
import moment from "moment";

import Count from "../models/Count";


class CountController {
    async index(req: Request, res: Response) {
        const columnValueTotal = '(value + addition) - (discount + IF(state!=9 and value!=paid, paid, 0))';
        const repository = getRepository(Count);
        const NumPerPage = 15;

        const query = repository.createQueryBuilder().select(`*, ${columnValueTotal} as total`).orderBy('maturity');
        const totalQueryPaid = repository.createQueryBuilder().where('state != 9 AND paid < value ');
        const totalQuery = repository.createQueryBuilder();

        let total:any = {TotalPages: 0, TotalValue: 0};
        let page = req.query.page || req.body.page || 0;

        /**
         * SETANDO OS FILTROS DA PESQUISA
         */
        if ( req.body.period || req.query.init ) {
            const period = req.body.period || req.query;
            const wherePeriod = `maturity BETWEEN '${period.init}' AND '${period.fim}'`;
            
            totalQueryPaid.andWhere(wherePeriod);
            totalQuery.where(wherePeriod);
            query.where(wherePeriod);
        }

        if ( req.body.state || req.query.state ) {
            const state = req.body.state || req.query.state;
            let whereStatus = `state = ${state}`;

            if ( state == 9 ) {
                whereStatus += ' OR paid >= value';
            } else {
                totalQueryPaid.andWhere(whereStatus);
            }
            
            
            totalQuery.andWhere(whereStatus);
            query.andWhere(whereStatus);
        }

        if ( page > 0 ) {
            query.offset( page * NumPerPage );
        }

        /**
         * CAPTURANDO OS TOTAIS
         */

        const totalPaid = await totalQueryPaid.select(`sum(${columnValueTotal}) as TotalValue`).getRawOne();
        total = await totalQuery.select(`count(*)/${NumPerPage} as TotalPages`).getRawOne();

        /**
         * Retornando os dados
         */
        const counts = await query.limit(NumPerPage).getRawMany();
        return res.json( {counts, total: {...total, ...totalPaid}, page, length: counts.length} );
    }

    async store(req: Request, res: Response) {
        const repository = getRepository(Count);
        const data : {
            description,
            state,
            value,
            maturity,
            addition,
            discount,
            paid,
            portion,
            fixed,
            note
        } = req.body;

        try{
            let counts = [];
            let portion_init = req.body.portion_init || 1;
            let day_fixed = req.body.day_fixed || 0;

            if( data.fixed && data.portion <= 0 ) {
                data.portion = 1;
                portion_init = 1;
            }

            let maturity = moment( data.maturity );

            for(var i = portion_init; i<=data.portion; i++){

                const portion = data.fixed ? '1/1' : `${i}/${data.portion}`;
                const nData = {...data, portion};

                /** SETANDO AS DATAS DAS PARCELAS */
                if( day_fixed && i > portion_init ) {
                    maturity = maturity.month(maturity.month() + 1);
                } else if( !day_fixed && i > portion_init ){
                    maturity = maturity.days(30);
                } else {
                    maturity = maturity;
                }

                nData.maturity = maturity.format('YYYY-MM-DD');


                /** SALVANDO OS DADOS */
                const count = repository.create(nData);
                await repository.save( count );
                
                counts.push( count );
            }

            return res.json(counts);
        } catch ( err ) {
            return res.status(409).send({ error: 'Account dont created.', err });
        }
    }

    async delete(req: Request, res: Response) {
        const repository = getRepository(Count);
        const { id } = req.body;

        const count = await repository.findOne({ where: {id} });

        if( !count ) {
            res.status(404).json({ error: "Account dont exists." });
        } else {
            await repository.delete({ id });
            return res.json({ count, message: 'Account deleted.' });
        }
    }
}

export default new CountController();