#!/bin/bash

# IntegridAI HackAI 2025 - Docker Quick Start Script
# This script helps participants get started quickly with Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art
echo -e "${BLUE}"
cat << "EOF"
 ___       _               _     _    ___ 
|_ _|_ __ | |_ ___  __ _ __(_) __| |  / _ \
 | || '_ \| __/ _ \/ _` / _` |/ _` | | | | |
 | || | | | ||  __/ (_| | (_| | (_| | | |_| |
|___|_| |_|\__\___|\__, |\__,_|\__,_|  \___/
                   |___/                    
    HackAI 2025 - Universidad Austral
EOF
echo -e "${NC}"

# Functions
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN} $1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check dependencies
check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check Docker
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        docker --version
    else
        print_error "Docker is not installed. Please install Docker first."
        echo "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
        docker-compose --version
    else
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        echo "Visit: https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is not running. Please start Docker."
        exit 1
    fi
}

# Show menu
show_menu() {
    print_header "IntegridAI HackAI 2025 - Docker Setup"
    
    echo -e "${PURPLE}Choose your development setup:${NC}\n"
    
    echo "1. 🚀 Quick Start (All services)"
    echo "2. 🎨 Frontend Only"
    echo "3. 🔌 Mock APIs Only" 
    echo "4. 🐳 Production Build"
    echo "5. 🛠️  Development with Debug Tools"
    echo "6. 🧹 Clean Up (Remove containers and volumes)"
    echo "7. 📊 Show Status"
    echo "8. 📝 View Logs"
    echo "9. ❓ Help"
    echo "0. 🚪 Exit"
    
    echo -e "\n${CYAN}Enter your choice [0-9]:${NC}"
}

# Quick start - all services
quick_start() {
    print_header "Starting Complete Development Environment"
    
    print_info "This will start:"
    echo "  - Frontend Dashboard (http://localhost:3000)"
    echo "  - Mock APIs (http://localhost:3001)"
    echo "  - API Documentation (http://localhost:3001/docs)"
    echo ""
    
    print_info "Building and starting containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_success "Environment started successfully!"
    
    echo -e "\n${GREEN}🎉 Ready for HackAI 2025!${NC}"
    echo -e "\n${YELLOW}Access URLs:${NC}"
    echo "  🎨 Frontend Dashboard: http://localhost:3000"
    echo "  🔌 Mock APIs: http://localhost:3001"
    echo "  📚 API Documentation: http://localhost:3001/docs"
    echo "  📊 Mock API Health: http://localhost:3001/api/mock/health"
    
    echo -e "\n${BLUE}💡 Tip: Run 'docker-compose -f docker-compose.dev.yml logs -f' to see live logs${NC}"
}

# Frontend only
frontend_only() {
    print_header "Starting Frontend Only"
    
    print_info "Starting frontend development server..."
    docker-compose -f docker-compose.dev.yml up --build frontend mock-apis-standalone -d
    
    print_success "Frontend environment started!"
    echo "  🎨 Frontend: http://localhost:3000"
    echo "  🔌 Mock APIs: http://localhost:3001"
}

# Mock APIs only
mock_apis_only() {
    print_header "Starting Mock APIs Only"
    
    print_info "Starting mock API server..."
    docker-compose -f docker-compose.dev.yml --profile mock-only up --build -d
    
    print_success "Mock APIs started!"
    echo "  🔌 Mock APIs: http://localhost:3001"
    echo "  📚 API Docs: http://localhost:3001/docs"
}

# Production build
production_build() {
    print_header "Production Build"
    
    print_info "Building production containers..."
    docker-compose -f docker-compose.yml --profile production up --build -d
    
    print_success "Production environment started!"
    echo "  🌐 Application: http://localhost"
    echo "  🔧 Nginx Proxy: Routing all traffic"
}

# Development with debug tools
development_debug() {
    print_header "Development with Debug Tools"
    
    print_info "Starting development environment with debugging tools..."
    docker-compose -f docker-compose.dev.yml --profile debug up --build -d
    
    print_success "Development environment with debug tools started!"
    echo "  🎨 Frontend: http://localhost:3000"
    echo "  🔌 Mock APIs: http://localhost:3001" 
    echo "  🗄️  Database Browser: http://localhost:8080"
}

# Clean up
clean_up() {
    print_header "Cleaning Up Docker Environment"
    
    print_warning "This will remove all IntegridAI containers, networks, and volumes."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Stopping containers..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.yml down -v
        
        print_info "Removing unused Docker resources..."
        docker system prune -f
        
        print_success "Cleanup completed!"
    else
        print_info "Cleanup cancelled."
    fi
}

# Show status
show_status() {
    print_header "Docker Environment Status"
    
    print_info "Running containers:"
    docker ps --filter "name=integridai" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    print_info "Docker compose services:"
    if [ -f docker-compose.dev.yml ]; then
        docker-compose -f docker-compose.dev.yml ps
    fi
}

# View logs  
view_logs() {
    print_header "Viewing Logs"
    
    echo "1. All services"
    echo "2. Frontend only"
    echo "3. Mock APIs only"
    echo "4. Choose specific service"
    
    read -p "Enter choice [1-4]: " choice
    
    case $choice in
        1) docker-compose -f docker-compose.dev.yml logs -f ;;
        2) docker-compose -f docker-compose.dev.yml logs -f integridai-dev ;;
        3) docker-compose -f docker-compose.dev.yml logs -f mock-apis-only ;;
        4) 
            echo "Available services:"
            docker-compose -f docker-compose.dev.yml config --services
            read -p "Enter service name: " service
            docker-compose -f docker-compose.dev.yml logs -f $service
            ;;
        *) print_error "Invalid choice" ;;
    esac
}

# Show help
show_help() {
    print_header "Help & Troubleshooting"
    
    echo -e "${YELLOW}Common Commands:${NC}"
    echo "  docker-compose -f docker-compose.dev.yml up -d    # Start in background"
    echo "  docker-compose -f docker-compose.dev.yml down     # Stop services"  
    echo "  docker-compose -f docker-compose.dev.yml logs -f  # View live logs"
    echo "  docker-compose -f docker-compose.dev.yml restart  # Restart services"
    echo ""
    
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo "  🔧 Port conflicts: Make sure ports 3000, 3001 are free"
    echo "  🔧 Permission issues: Try running with sudo (Linux)"
    echo "  🔧 Build failures: Run 'docker system prune' and try again"
    echo "  🔧 Database issues: Delete ./data/ folder and restart"
    echo ""
    
    echo -e "${YELLOW}Getting Help:${NC}"
    echo "  💬 GitHub Issues: https://github.com/adrianlerer/integridai-hackai-2025/issues"
    echo "  💬 Discord: #hackathon-docker-help"
    echo "  💬 Email: adrian@lerer.com.ar"
}

# Main execution
main() {
    # Check if running in project directory
    if [ ! -f "package.json" ] || [ ! -f "docker-compose.dev.yml" ]; then
        print_error "Please run this script from the integridai-hackai-2025 project root directory."
        exit 1
    fi
    
    check_dependencies
    
    while true; do
        show_menu
        read -r choice
        
        case $choice in
            1) quick_start ;;
            2) frontend_only ;;
            3) mock_apis_only ;;
            4) production_build ;;
            5) development_debug ;;
            6) clean_up ;;
            7) show_status ;;
            8) view_logs ;;
            9) show_help ;;
            0) 
                echo -e "${GREEN}¡Éxito en el HackAI 2025! 🚀${NC}"
                exit 0
                ;;
            *)
                print_error "Invalid choice. Please enter a number between 0-9."
                ;;
        esac
        
        echo -e "\n${BLUE}Press Enter to continue...${NC}"
        read
    done
}

# Run main function
main "$@"