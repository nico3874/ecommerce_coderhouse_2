import { Router } from "express";

const router = Router()


router.get('/', (req, res)=>{
        
        req.logger.fatal('FATAL ERROR')
        req.logger.error('No podemos conectar a la base de datos')
        req.logger.warning('Cuidado, datos vulnerables')
        req.logger.info('Se conectó a la ruta solicitada')
        req.logger.debug('2 x 2 ===4')
        
    
        res.send({message: 'Prueba de logger'})
    
})

export default router