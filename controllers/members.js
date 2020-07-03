const fs = require('fs')
const data = require('../data.json')
const { date } = require('../utils')
const e = require('express')

exports.index = (req, res) => {
    return res.render('members/index', { members: data.members })
}

//show
exports.show = (req, res) => {
    const { id } = req.params
    
    const foundMember = data.members.find( member => {
        return member.id == id
    })

    if(!foundMember) return res.send('Member not found!')

    const member = {
        ...foundMember, // add tudo que apresenta no foundMember (todos os dados do instrutor cadastrado)
        birth: date(foundMember.birth).birthDate,            // sendo que essas props abaixo ele vai alterando para a aprensentação correta no front
    }

    return res.render('members/show', { member: member })
}

//create
exports.create = (req, res) => {
    return res.render('members/create')
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

    birth = Date.parse(req.body.birth)
    
    let id = 1
    const lastMember = data.members[data.members.length - 1]

    if( lastMember ) {
        id = lastMember.id + 1
    }

    data.members.push({
        id,
        ...req.body,
        birth
    }) // add cada instrutor cadastrado, como objeto, dentro do array members

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send('Write file error')

        return res.redirect(`/members/${id}`)
    })
}

//edit
exports.edit = (req, res) => {
    const { id } = req.params  // req.params são parâmetros da url

    const foundMember = data.members.find( member => {
        return member.id == id
    })

    if(!foundMember) return res.send('Member not found!')

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).iso
    }

    return res.render('members/edit', {member: member} )
}

//put
exports.put = (req, res) => {
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find( (member, foundIndex) => {
        if ( id == member.id ) {
            index = foundIndex
            return true
        }
    })

    if(!foundMember) return res.send('Member not found!')

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)  //força o id ser um tipo number
    }

    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send('Write error!')

        return res.redirect(`/members/${id}`)
    })
}

//delete
exports.delete = (req, res) => {
    const { id } = req.body

    const filteredMembers = data.members.filter( member => {
        return member.id != id
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), err => {
        if(err) return res.send('Write error!')

        return res.redirect('/members')
    })
}