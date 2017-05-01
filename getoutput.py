import pync
import subprocess

prevLine = ''
isError = False
with subprocess.Popen(['webpack', '--watch'], stdout=subprocess.PIPE, universal_newlines=True) as process:
	for line in process.stdout:
		print(line, end='')
		print(prevLine.startswith('Hash: '))
		print(line.startswith('Version: '))
		if prevLine.startswith('Hash: ') and line.startswith('Version: '):
			pync.Notifier.notify('Webpack script built without error', title='Webpack Build', sound='default', closeLabel='Clone', sender='com.microsoft.VSCode', activate='com.microsoft.VSCode')
		if isError:
			pync.Notifier.notify('Error while building webpack script ' + prevLine.replace('ERROR in ' , '') + ':\n' + line, title='Webpack Build', sound='Basso', closeLabel='Clone', sender='com.microsoft.VSCode', activate='com.microsoft.VSCode')
			isError = False
		if line.startswith('ERROR in '):
			isError = True
		prevLine = line