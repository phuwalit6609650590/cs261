1.git clone https://github.com/phuwalit6609650590/cs261.git
2.docker build -f DockerContainer_NodeJS.dockerfile -t node-js-image .
3.docker run -p 3000:3000 node-js-image
