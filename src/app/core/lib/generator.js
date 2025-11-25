const sections = []
let grades = ['CUARTO', 'QUINTO', 'SEXTO']

for (let grade of grades) {
	sections.push({
		user: '68adcd70f2c3549e13f95b4c',
		school: '68adcde5f2c3549e13f95b53',
		level: 'PRIMARIA',
		year: grade,
		name: grade[0] + grade.slice(1).toLowerCase() + ' de Primaria',
		subjects: [
			'EDUCACION_ARTISTICA',
		]
	})
}

grades = ['PRIMERO', 'SEGUNDO']
for (let grade of grades) {
	sections.push({
		user: '68adcd70f2c3549e13f95b4c',
		school: '68adcde5f2c3549e13f95b53',
		level: 'SECUNDARIA',
		year: grade,
		name: grade[0] + grade.slice(1).toLowerCase() + ' de Secundaria',
		subjects: [
			'EDUCACION_ARTISTICA',
		]
	})
}

for (let section of sections) {
	// fetch('https://api.kitmaestro.com/class-sections', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		'x-': 'Bearer ' + atob("ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SWtYMThpT25zaVlXTjBhWFpsVUdGMGFITWlPbnNpY0dGMGFITWlPbnNpWlcxaGFXd2lPaUpwYm1sMElpd2ljbTlzWlNJNkltUmxabUYxYkhRaUxDSnNhV3RsWkZKbGMyOTFjbU5sY3lJNkltbHVhWFFpTENKa2FYTnNhV3RsWkZKbGMyOTFjbU5sY3lJNkltbHVhWFFpTENKaWIyOXJiV0Z5YTNNaU9pSnBibWwwSWl3aWNIVnlZMmhoYzJWa1VtVnpiM1Z5WTJWeklqb2lhVzVwZENJc0lsOXBaQ0k2SW1sdWFYUWlMQ0p5WldaRGIyUmxJam9pYVc1cGRDSXNJbkJoYzNOM2IzSmtTR0Z6YUNJNkltbHVhWFFpTENKamNtVmhkR1ZrUVhRaU9pSnBibWwwSWl3aWRYQmtZWFJsWkVGMElqb2lhVzVwZENJc0lsOWZkaUk2SW1sdWFYUWlMQ0ptYVhKemRHNWhiV1VpT2lKcGJtbDBJaXdpWjJWdVpHVnlJam9pYVc1cGRDSXNJbXhoYzNSdVlXMWxJam9pYVc1cGRDSXNJbkJvYjI1bElqb2lhVzVwZENJc0luUnBkR3hsSWpvaWFXNXBkQ0lzSW5WelpYSnVZVzFsSWpvaWFXNXBkQ0o5TENKemRHRjBaWE1pT25zaWNtVnhkV2x5WlNJNmUzMHNJbVJsWm1GMWJIUWlPbnNpY205c1pTSTZkSEoxWlgwc0ltbHVhWFFpT25zaVgybGtJanAwY25WbExDSmxiV0ZwYkNJNmRISjFaU3dpYkdsclpXUlNaWE52ZFhKalpYTWlPblJ5ZFdVc0ltUnBjMnhwYTJWa1VtVnpiM1Z5WTJWeklqcDBjblZsTENKaWIyOXJiV0Z5YTNNaU9uUnlkV1VzSW5CMWNtTm9ZWE5sWkZKbGMyOTFjbU5sY3lJNmRISjFaU3dpY21WbVEyOWtaU0k2ZEhKMVpTd2ljR0Z6YzNkdmNtUklZWE5vSWpwMGNuVmxMQ0pqY21WaGRHVmtRWFFpT25SeWRXVXNJblZ3WkdGMFpXUkJkQ0k2ZEhKMVpTd2lYMTkySWpwMGNuVmxMQ0ptYVhKemRHNWhiV1VpT25SeWRXVXNJbWRsYm1SbGNpSTZkSEoxWlN3aWJHRnpkRzVoYldVaU9uUnlkV1VzSW5Cb2IyNWxJanAwY25WbExDSjBhWFJzWlNJNmRISjFaU3dpZFhObGNtNWhiV1VpT25SeWRXVjlmWDBzSW5OcmFYQkpaQ0k2ZEhKMVpYMHNJaVJwYzA1bGR5STZabUZzYzJVc0lsOWtiMk1pT25zaWNtOXNaU0k2SW5SbFlXTm9aWElpTENKZmFXUWlPaUkyTnpBMU5XVmlZekk0TlRFMll6VmxZell4TVdFek1EY2lMQ0psYldGcGJDSTZJbTl5WjJGc1lYa3VaR1YyUUdkdFlXbHNMbU52YlNJc0lteHBhMlZrVW1WemIzVnlZMlZ6SWpwYlhTd2laR2x6YkdsclpXUlNaWE52ZFhKalpYTWlPbHRkTENKaWIyOXJiV0Z5YTNNaU9sdGRMQ0p3ZFhKamFHRnpaV1JTWlhOdmRYSmpaWE1pT2x0ZExDSnlaV1pEYjJSbElqb2liM0puWVd4aGVTNWtaWFlpTENKd1lYTnpkMjl5WkVoaGMyZ2lPaUlrTW1Ja01UQWtTV2wxYmsxSldWSnpiRlZsWm1aUGRVNVdSak5LWld4a1dVWmljak41T1U5dVJEWkpNVFpEUWtkQ1psRTBVWGhoWTNwWWMzVWlMQ0pqY21WaGRHVmtRWFFpT2lJeU1ESTBMVEV3TFRBNFZERTJPak16T2pBeExqQTRObG9pTENKMWNHUmhkR1ZrUVhRaU9pSXlNREkwTFRFd0xURTBWREUwT2pJd09qUXdMalF3TUZvaUxDSmZYM1lpT2pBc0ltWnBjbk4wYm1GdFpTSTZJazkwYjI1cFpXd2lMQ0puWlc1a1pYSWlPaUpJYjIxaWNtVWlMQ0pzWVhOMGJtRnRaU0k2SWxKbGVXVnpJRWRoYkdGNUlpd2ljR2h2Ym1VaU9pSTRNRGswTmpVNU5qVXdJaXdpZEdsMGJHVWlPaUpNYVdOa2J5SXNJblZ6WlhKdVlXMWxJam9pSW4wc0ltbGhkQ0k2TVRjMU5qSTVNalkxTUN3aVpYaHdJam94TnpVNE9EZzBOalV3ZlEua3lUT2Q1M0VicThfNjJOQV92TEU1NmRvVkIxMVZpdkJMSmpsaG9NZ3BBTQ==")
	// 	},
	// 	body: JSON.stringify(section)
	// }).then(res => res.json()).then(data => console.log(data))
	console.log(section)
}
