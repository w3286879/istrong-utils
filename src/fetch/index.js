import 'whatwg-fetch'		// fetch支持

const mockApi = {}
const mockData = {}
const _options = {}

// 配置
export function config(options) {
	Object.assign(_options, options)
	if (options.token) {
		setAccessToken(options.token)
	}
}

// mock 调用
export function mock(url, handler) {
	/*url = {
		'test/url1':()=>{},
		'test/url2':()=>{}
	}*/
	if (url && typeof url == "object") {
		Object.keys(url).forEach(u => {
			mock(u, url[u])
		})
	}

	//url=v1/*/
	//handler={
	//	person:()=>{}
	//}
	//
	else if (url.indexOf("*") != -1) {
		let paths = url.split('*')
		let pre = paths.shift()
		Object.keys(handler).forEach(key => {
			let theUrl = pre + key + paths.join('*')
			mock(theUrl, handler[key])
		})
	} else {
		mockApi[url] = handler;
	}
}

// 判断是否是mock的url
function isMockUrl(url) {
	if (!_options.excludeMockUrls)
		return _options.mock

	if (_options.excludeMockUrls.find(o => o == url)) {
		return !_options.mock
	}
	else {
		return _options.mock
	}
}

// get 提交
export function get(url, headers, option) {
	if (!option || option.ignoreAOP !== true) {
		before()
	}

	if (isMockUrl(url)) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					if (getAccessToken()) {
						headers = headers ? { ...headers, token: getAccessToken() } : { token: getAccessToken() }
					}
					var resp = mockApi[url](headers)
					if (resp.then && resp.catch) {
						resp.then(r => {
							resp = after(resp, url, undefined, headers)
							return resolve(resp)
						}).catch(reject)
						return resp
					}
					else if (!option || option.ignoreAOP !== true) {
						resp = after(resp, url, undefined, headers)
					}
					resolve(resp)
				}
				catch (e) {
					reject(e)
				}
			}, 0)
		})
	}

	headers = {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
			token: getAccessToken()
		},

	}

	return new Promise((resolve, reject) => {
		fetch(url, headers)
			.then(response => response.json())
			.then(responseJson => {
				responseJson = after(responseJson, url, undefined, headers)
				resolve(responseJson)
			})
			.catch(error => reject(error))
	})
}

// post 提交
export function post(url, data, headers, option) {
	if (!option || option.ignoreAOP !== true) {
		before(url, data, headers)
	}
	if (isMockUrl(url)) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					if (getAccessToken()) {
						headers = headers ? { ...headers, token: getAccessToken() } : { token: getAccessToken() }
					}
					var resp = mockApi[url](data, headers)
					if (resp.then && resp.catch) {
						resp.then(r => {
							r = after(r, url, data, headers)
							return resolve(r)
						}).catch(reject)
						return resp
					}
					else if (!option || option.ignoreAOP !== true) {
						resp = after(resp, url, data, headers)
					}
					resolve(resp)
				}
				catch (e) {
					reject(e)
				}
			}, 0)
		})
	}

	headers = {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			...headers,
			token: getAccessToken()
		},
		body: JSON.stringify(data)
	}

	return new Promise((resolve, reject) => {
		fetch(url, headers)
			.then(response => response.json())
			.then(responseJson => {
				responseJson = after(responseJson, url, data, headers)
				resolve(responseJson)
			})
			.catch(error => reject(error))
	})

}

// 表单post 提交
export function formPost(url, data, isFree) {
	data = data || {}
	var accessToken = getAccessToken()//toke in sessionStorage
	if (!!accessToken && !isFree) {
		data.token = accessToken
	}

	var postForm = document.createElement("form")//表单对象
	postForm.method = "post"
	postForm.action = url
	postForm.target = "_blank"

	var keys = Object.keys(data)

	for (var k of keys) {
		var emailInput = document.createElement("input");//email input
		emailInput.setAttribute("name", k)
		emailInput.setAttribute("value", data[k])
		postForm.appendChild(emailInput)
	}

	document.body.appendChild(postForm)
	postForm.submit()
	document.body.removeChild(postForm)
}

export function test(url, data, result) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(result)
		}, 0)
	})
}

function before(url, data, headers) {
	if (_options.before) {
		_options.before(url, data, headers)
	}
}

function after(response, url, data, headers) {
	if (_options.after) {
		return _options.after(response, url, data, headers)
	}

	return response
}

// 获得token 数据
function getAccessToken() {
	// 网站保存Token数据
	return sessionStorage['_accessToken'] || '';
}

// 设置token 数据
function setAccessToken(token) {
	sessionStorage['_accessToken'] = token;
}

// 清空token 数据
function clearAccessToken() {
	sessionStorage['_accessToken'] = ''
}

export default {
	config,
	fetch,
	get,
	post,
	formPost,
	test,
	mockData,
	mock,
	mockApi,
	getAccessToken,
	setAccessToken,
	clearAccessToken
}