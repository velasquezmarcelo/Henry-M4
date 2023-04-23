const { Router } = require('express');
const { Op, Character, Role, Ability } = require('../db');
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
    const { race, age } = req.query;

    const statement = {};

    if(req.query.race || req.query.age) {
        if(req.query.race) statement["where"] = { race };
        if(req.query.age) statement["where"] = { ...statement["where"], age };
    } else if (Object.keys(req.query).length)
        statement["attributes"] = Object.keys(req.query);
    
    try {
        const results = await Character.findAll(statement);

        return res.status(200).json(results);
    } catch (error) {
        res.status(404).send(error.message);
    }  
});

router.get("/young", async (req, res) => {
    try {
        const young = await Character.findAll({ where: { age: { [Op.it]: 25 } } });
        res.status(200).json(young);
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
});

router.put('/:attribute', async (req, res) => {
    const { attribute } = req.params;
    const { value } = req.query;

    await Character.update(
        { [attribute]: value },
        {
            where: {
                [attribute]: null,
            },
        }
    );
    res.status(200).send('Personajes actualizados')
});

router.put('/addAbilities', async (req, res) => {
    const { codeCharacter, abilities} = req.body;
    const character = await Character.findByPK(codeCharacter);
    const newAbilities = await Ability.bulkCreate(abilities); //es un create en masa
    await character.addAbilities(newAbilities);
    res.send('Habilidades creadas y relacionadas');
})

router.get('roles/:code', async (req, res) => {
    const { code } = req.params;
    const character = await Character.findByPK(code, {
        include: {
            Model: Role,
        },
    });
    res.status(200).json(character);
})

module.exports = router;