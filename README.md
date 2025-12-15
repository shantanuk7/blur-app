# Client-Server Application

This is a MERN stack application deployed via Jenkins on Kubernetes.

## Structure
- `client/`: React Frontend (Vite)
- `server/`: Node.js Backend
- `k8s/`: Kubernetes Manifests
- `Jenkinsfile`: CI/CD Pipeline definition

## Deployment
The application is deployed to the college Kubernetes cluster locally using Jenkins.

### Access
Frontend: http://2401106.imcc.com
Backend: http://server.2401106.svc.cluster.local:5000 (Internal)

## Health Checks
- Server Health: `/health` (Port 5000)
- Client: Serves static files on Port 80
