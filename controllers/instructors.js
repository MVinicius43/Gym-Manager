const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils')
const e = require('express')

exports.index = (req, res) => {
    return res.render('instructors/index', { instructors: data.instructors })
}

//show
exports.show = (req, res) => {
    const { id } = req.params
    
    const foundInstructor = data.instructors.find( instructor => {
        return instructor.id == id
    })

    if(!foundInstructor) return res.send('Instructor not found!')

    const instructor = {
        ...foundInstructor, // add tudo que apresenta no foundInstructor (todos os dados do instrutor cadastrado)
        age: age(foundInstructor.birth),            // sendo que essas props abaixo ele vai alterando para a aprensentação correta no front
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at),
    }

    return res.render('instructors/show', { instructor: instructor })
}

//create
exports.create = (req, res) => {
    return res.render('instructors/create')
}

//post
exports.post = (req, res) => {

    // estrutura de validação se todos os dados foram preenchidos
    const keys = Object.keys(req.body)

    for( key of keys ) {
        if( req.body[key] == "" ) {
            return res.send('Please, fill all fields!')
        }
    }

    // desestrutura objeto req.body
    let { avatar_url, birth, gender, name, services } = req.body

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    }) // add cada instrutor cadastrado, como objeto, dentro do array instructors

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send('Write file error')

        return res.redirect(`/instructors/${id}`)
    })
}

//edit
exports.edit = (req, res) => {
    const { id } = req.params  // req.params são parâmetros da url

    const foundInstructor = data.instructors.find( instructor => {
        return instructor.id == id
    })

    if(!foundInstructor) return res.send('Instructor not found!')

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render('instructors/edit', {instructor: instructor} )
}

//put
exports.put = (req, res) => {
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find( (instructor, foundIndex) => {
        if ( id == instructor.id ) {
            index = foundIndex
            return true
        }
    })

    if(!foundInstructor) return res.send('Instructor not found!')

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)  //força o id ser um tipo number
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send('Write error!')

        return res.redirect(`/instructors/${id}`)
    })
}

//delete
exports.delete = (req, res) => {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter( instructor => {
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
        if(err) return res.send('Write error!')

        return res.redirect('/instructors')
    })
}