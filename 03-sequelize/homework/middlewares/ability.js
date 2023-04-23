const { Router } = require('express');
const { Ability } = require('../db');
const router = Router();

router.post('/', async(req, res) => {
    const { name, description, mana_cost } = req.body;
    try {
        if (!name || !mana_cost) throw Error('Falta enviar datos obligatorios');
        const newAbility = await Ability.create({ name, mana_cost, description });
        return res.status(201).json(newAbility);
    } catch (error) {
        return res.status(404).send(error.messege);
    }
});

router.put('/setCharacter', async(req, res) => {
    const { idAbility, codeCharacter } = req.body;
    const ability = await Ability.findByPK(idAbility);
    await ability.setCharacter(codeCharacter); //set es para uno y add para varios
    res.status(200).json(ability);
})

module.exports = router;