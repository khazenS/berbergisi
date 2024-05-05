const registerControlFunc = (values) => {
    let errors = []
    if(values.name.length === 0){
        errors.push('nameRequired')
    }
    if(values.phoneNumber.toString().length != 10){
        errors.push("wrongNumber")
    }

    return errors
}

export default registerControlFunc;