pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    args: ["--registry-mirror=https://mirror.gcr.io", "--storage-driver=overlay2", "--insecure-registry=nexus.imcc.com"]
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""

  volumes:
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    stages {

        stage('Build Docker Images') {
            steps {
                container('dind') {
                    sh '''
                        sleep 15
                        docker build -t server:latest ./server
                        docker build -t client:latest ./client
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401106', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401106_client-server-app \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        docker logout || true
                        docker login http://nexus.imcc.com/2401106 -u admin -p Changeme@2025
                    '''
                }
            }
        }

        stage('Tag + Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag server:latest nexus.imcc.com/2401106/server:latest
                        docker tag client:latest nexus.imcc.com/2401106/client:latest

                        docker push nexus.imcc.com/2401106/server:latest
                        docker push nexus.imcc.com/2401106/client:latest
                    '''
                }
            }
        }

        stage('Create Namespace if Not Exists') {
            steps {
                container('kubectl') {
                    sh 'kubectl apply -f k8s-deployment/namespace.yaml || true'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s-deployment') {
                        sh '''
                            kubectl apply -f server-deployment.yaml
                            kubectl apply -f server-service.yaml
                            kubectl apply -f client-deployment.yaml
                            kubectl apply -f client-service.yaml

                            kubectl rollout status deployment/server -n 2401106
                            kubectl rollout status deployment/client -n 2401106
                        '''
                    }
                }
            }
        }
    }
}
