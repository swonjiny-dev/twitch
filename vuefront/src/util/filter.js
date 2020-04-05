const currency = (val)=>{
    if (!val) return '';
    return val.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");
}

export {
    currency
}