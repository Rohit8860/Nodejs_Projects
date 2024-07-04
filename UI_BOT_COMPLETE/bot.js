$('span.field.criterion_RADIO.criterion_LIST.error span.multiple span').each((index,Element)=>{
    const input_ = $(Element).find('input').attr('value')
    const butto = $(Element).find('input')
    console.log(input_)
    if(input_ ==="DE"){
        butto.click();
    };
    const continu = $('span#saveButton a').click();
})