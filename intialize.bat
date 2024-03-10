call pip install virtualenv
call virtualenv envsmart
call .\envsmart\Scripts\activate
call pip install -r requirement.txt
cd frontend
call npm install
