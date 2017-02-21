function geocode(options){
	return new Promise((resolve,reject)=>{
		const geocoder = new google.maps.Geocoder;
		geocoder.geocode(options, (results, status)=>{
			if(status === 'OK'){
				if(results.length){
					 resolve(results);
				}else{
						reject(`No results`);
				}
			}else{
				reject('Geocoder failed due to ' + status);
			}
		});
	});
}

export default geocode;
