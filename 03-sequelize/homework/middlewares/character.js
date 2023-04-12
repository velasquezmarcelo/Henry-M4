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

router.get('/', async (req, res) => {
    const { race } = req.query;
    const attributes = Object.keys(req.query);

    try {
        const results = race
        ? await Character.findAll({where: { race } })
        : await Character.findAll({  });

        return res.status(200).json(results);
    } catch (error) {
        res.status(404).send(error.message);
    }  
});

router.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const character = await Character.findByPk(code);
        if (!character) throw Error;
        return res.status(200).json(character);
    } catch (error) {

        return res
            .status(404)
            .send(`El código ${code} no corresponde a un personaje existente`);
    }
})

module.exports = router;