export function parseData(originalObjects){
    let columns = [];
    originalObjects.forEach((originalObject, index) => {
        Object.keys(originalObject).map(key => {
            if(key !== '_id'){
            
            let data = originalObject[key]
            if(columns.indexOf(key)<0 && (typeof(data)!== 'object' ||data instanceof Date))columns.push(key);
            if (data?.isArray){
                originalObject[key]= data.toString()
            } else if (data && typeof (data) === 'object'){
                Object.keys(data).map(subkey => {
                    if(columns.indexOf(`${key}_${subkey}`)<0)columns.push(`${key}_${subkey}`);
                    originalObject[`${key}_${subkey}`] = data[subkey]
                })
            }}
            if(typeof(originalObject[key] ==='string') && originalObject[key]?.length >300){
                originalObject[key] = originalObject[key].slice(0,300);
            }
        });
        originalObjects[index] = originalObject;
    });
    return {
        data:originalObjects,
        columns
    }
}