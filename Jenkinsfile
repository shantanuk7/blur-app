pipeline {
  agent any
  environment {
    COMPOSE_FILE = 'docker-compose.yml'
  }
  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/shantanuk7/blur-app.git',
            branch: 'main',
            credentialsId: '997092da-5bee-45b2-b45b-7a5cf133832a'
      }
    }

    stage('Build Images') {
      steps {
        script {
          def SERVER_URL = "http://127.0.0.1:5000"
          sh """
            docker compose -f ${COMPOSE_FILE} build --pull --no-cache
          """
        }
      }
    }

    stage('Deploy (docker compose)') {
      steps {
        sh """
          docker compose -f ${COMPOSE_FILE} down || true
          docker compose -f ${COMPOSE_FILE} up -d --remove-orphans
        """
      }
    }

    stage('Post-Deploy Check') {
      steps {
        sh 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"'
        sh 'sleep 5'
        sh 'curl -sS http://127.0.0.1:5000/api/auth || true'
      }
    }
  }
}
