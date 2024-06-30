import db from '../models/db.js';

export const createCompany = async (req, res) => {
    const { companyName, expireDate} = req.body;
    try {
        const expireDateId = await db.select('*').where('nameExpire', expireDate).from('expireDate').first();
        if (!expireDateId) return res.status(404).json({message: "Fecha de expiración no encontrada"});
        const company = await db('companys').insert({companyName: companyName, idExpire: expireDateId.idExpire});
        await db.raw(
            `CREATE EVENT ${companyName + company[0]}
            ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 SECOND
            DO
                UPDATE companys 
                SET status = false
                WHERE idCompany = ${company[0]};
            `
        );
        
        return res.status(201).json({message: company});

    } catch (error) {
        console.log(error);
    }

}

export const updateCompanys = async (req, res) => {
    const { idCompany } = req.params;

    try{
        const companyExists = await db.select('*').where('idCompany', idCompany).from('companys').first();
        if (!companyExists) return res.status(404).json({message: "Compañía no encontrada"});
        
        const companyStatus = Boolean(companyExists.status).valueOf();
        
        const { 
                companyName = companyExists.companyName, 
                expireDate = companyExists.idExpire, 
                status = companyStatus
              } = req.body;

        if(expireDate !== companyExists.idExpire || status !== companyStatus){
            console.log(true === companyExists.idExpire)
            if(expireDate !== companyExists.idExpire || expireDate !== companyExists.idExpire && status !== companyStatus){

                const expireDateId = await db.select('*').where('nameExpire', expireDate).from('expireDate').first();

                if (!expireDateId) return res.status(404).json({message: "Fecha de expiración no encontrada"});
                await db('companys').where('idCompany', idCompany).update({companyName: companyName, idExpire: expireDateId.idExpire, status: status});
                
                if(status === companyStatus){
                    if(companyStatus){
                        await db.raw(
                            `DROP EVENT IF EXISTS ${companyExists.companyName + idCompany};`
                        );
        
                        await db.raw(
                            `CREATE EVENT ${companyName + idCompany}
                            ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expireDateId.expireDate} DAY
                            DO
                                UPDATE companys 
                                SET status = false
                                WHERE idCompany = ${idCompany};
                            `
                        );
                    }
                    return 
                }

                if(companyStatus){
                    await db.raw(
                        `DROP EVENT IF EXISTS ${companyExists.companyName + idCompany};`
                    );
                }
                else{
                    await db.raw(
                        `CREATE EVENT ${companyName + idCompany}
                        ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expireDateId.expireDate} DAY
                        DO
                            UPDATE companys 
                            SET status = false
                            WHERE idCompany = ${idCompany};
                        `
                    );
                }

            }
            else if(status !== companyStatus){
                const expireDateId = await db.select('*').where('idExpire', expireDate).from('expireDate').first();
                await db('companys').where('idCompany', idCompany).update({companyName: companyName, idExpire: expireDate, status: status});
                if(companyStatus){
                    await db.raw(
                        `DROP EVENT IF EXISTS ${companyExists.companyName + idCompany};`
                    );
                }
                else{
                    await db.raw(
                        `CREATE EVENT ${companyName + idCompany}
                        ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL ${expireDateId.expireDate} DAY
                        DO
                            UPDATE companys 
                            SET status = false
                            WHERE idCompany = ${idCompany};
                        `
                    );
                }
            }
            return res.status(200).json({message: "Compañía actualizada correctamente"});
        }
        
        await db('companys').where('idCompany', idCompany).update({companyName: companyName, idExpire: expireDate, status: status});
    
        return res.status(200).json({message: "Compañía actualizada correctamente"});
    }
    catch(error){
        console.log(error);
    }
}