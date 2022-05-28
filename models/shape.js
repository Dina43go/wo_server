class DataShape {

    static hospitals(data) {
        let embeded=[];
        for(let index=0 ; index < data.length ; index ++) {
            embeded.push({
                hopitalProfileId: data[index].hopitalProfileId,
                designation: data[index].designation,
                email: data[index].email,
                tel: [data[index].tel_1,data[index].tel_2],
                position: {lng: data[index].lng , lat: data[index].lat},
                emergency: {
                    driverNumbers: data[index].driverNumbers,
                    disponibility: data[index].available? true: false,
                }
            });
        }
        return embeded;
    }

    static emergency(data) {
        
        return [{
            driverNumbers: data.driverNumbers,
            disponibility: data.available
        }];
    }
}

module.exports = DataShape;