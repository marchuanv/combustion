fetchExt

function PostWithRedirect({ toke}, redirectUrl) {
    return fetch("", { method: "POST", redirect: 'follow', headers, body:JSON.stringify({ redirectUrl: "/designer" } )})  //check if token is valid and redirect
    .then(function(response) {
        return new Promise(function(resolve){
            if (response.redirected) {
                location.href = response.url;
            } else {
                resolve(response);
            }
        });
    })    
    .catch(function(err) {console.log(err);});
}