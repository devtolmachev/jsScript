// Pattern https://domain.com?
// fbp=903462134925317&
// subid=1234567&
// sub1={{ad.name}}&
// sub2=2908&
// sub3=143354&
// sub4=12345&
// sub5={{placement}}&
// sub6=12345&
// sub7={{campaign.name}}&
// fbclid=IwY2xjawEuB01leHRuA2FlbQEwAAEdI_hfS60HzfJzr9bm2N-ee2UnIxTRPc-ug7SBvlSademc5YX-j6ViOOwl_aem_eUUrj2mq_b0s6EYyypCOxQ

var backend_url = document.currentScript.dataset.backend_url;
if (!backend_url) {
    var backend_url = "";
}
var mode = document.currentScript.dataset.mode;
if (!mode) {
    var mode = 1;
}

function generateExternalId() {
    let id = String(Math.floor(Math.random() * 999999999999) + 100000000000);
    return id + `${Date.now()}`
}

function replaceLinksOnSite(paramsToAppend) {
    let links = document.querySelectorAll('a');
    links.forEach(a => {
        let currentHref = a.href;
        let urlObj = new URL(currentHref);

        Object.keys(paramsToAppend).forEach(key => {
            urlObj.searchParams.set(key, paramsToAppend[key]);
        });
        a.href = urlObj.href;
    });
}

function getUA() {
    return navigator.userAgent;
}

async function getIp() {
    let resp = await fetch("https://ipinfo.io/ip");
    return await resp.text();
}

function getPathParameters(url) {
    let url_obj = new URL(url);

    let params = url_obj.searchParams;
    return Object.fromEntries(params.entries());
}

async function sendData(data) {
    try {
        let resp = await fetch(backend_url, {
            method: "POST",
            body: JSON.stringify(data)
        });
        if (!resp.ok) {
            throw new Error(`HTTP error status: ${resp.status}`);
        }
        return await resp.json();
    } catch (error) {
        console.error('Error sending data:', error);
    }

}

async function main() {
    try {
        var params = getPathParameters(url)
        let externalId = generateExternalId();
        params.external_id = externalId;
        replaceLinksOnSite(params);

        let ua = getUA();
        let ip = await getIp();
        let clientUrl = new URL(url);

        params.ip = ip;
        params.user_agent = ua;
        params.domain = clientUrl.origin;

        console.log(params);
        // return ;
        let response = await sendData(params);
        console.log(response);
    } catch (error) {
        console.error('Error in main func: ', error)
    }
}

// var url = "https://domain.com?fbc=12345&fbp=903462134925317&subid=1234567&sub1=ad_name&sub2=2908&sub3=143354&sub4=12345&sub5=placement&sub6=12345&sub7=campaign_name&fbclid=IwY2xjawEuB01leHRuA2FlbQEwAAEdI_hfS60HzfJzr9bm2N-ee2UnIxTRPc-ug7SBvlSademc5YX-j6ViOOwl_aem_eUUrj2mq_b0s6EYyypCOxQ";
var url = window.location.href;
main()
