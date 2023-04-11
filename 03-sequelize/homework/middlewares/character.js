const { Router } = require('express');
const { Op, Character, Role } = require('../db');
const router = Router();

router.post('/', async (req, res) => {
    const {code, name, age, race, hp, mana} = req.body; 
    if(![code, name, hp, mana].every(Boolean))  
        return res.status(404).send("Falta enviar datos obligatorios");
    try {
        const newCharacter = await Character.create({
            code,
            name,
            age,
            race,
            hp,
            mana,
        });
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(404).send( "Error en alguno de los datos provistos");
    }    
});

module.exports = router;