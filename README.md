# FoamPilot - Modern GUI for OpenFOAM

FoamPilot is a cutting-edge web-based graphical user interface designed to streamline OpenFOAM CFD workflows with modern AI capabilities. Built with React, TypeScript, and Tailwind CSS, it provides an intuitive interface for managing simulations, editing configuration files, and optimizing parameters.

<!-- ![FoamPilot Dashboard](https://via.placeholder.com/800x400/1e293b/0ea5e9?text=FoamPilot+Dashboard) -->

## ✨ Features

### 🗂️ Case Management
- **Intuitive File Browser**: Navigate OpenFOAM directory structures with ease
- **Project Organization**: Create, manage, and organize simulation cases
- **Template System**: Start from predefined case templates
- **Import/Export**: Share cases and configurations

### 📝 Advanced File Editor  
- **Syntax Highlighting**: Full OpenFOAM dictionary syntax support
- **Auto-completion**: Intelligent suggestions for keywords and parameters
- **Error Detection**: Real-time validation of dictionary syntax
- **Multi-tab Support**: Edit multiple files simultaneously

### 🤖 AI Parameter Optimizer
- **Smart Suggestions**: AI-powered recommendations for solver settings
- **Performance Analysis**: Optimize numerical schemes and parameters
- **Convergence Prediction**: Estimate simulation stability and performance
- **Best Practices**: Automated checks against OpenFOAM guidelines

### 🔷 AI blockMeshDict Generator
- **Natural Language Input**: Describe geometry in simple terms
- **Automated Generation**: AI creates complete blockMeshDict files
- **Mesh Quality Validation**: Built-in checks for mesh quality metrics
- **Interactive Preview**: Visualize mesh structure before generation

### 📊 Real-time Simulation Console
- **Live Output Monitoring**: Stream solver output in real-time
- **Residual Tracking**: Visual graphs of convergence history
- **Performance Metrics**: Monitor CPU, memory, and simulation progress
- **Error Handling**: Intelligent error detection and suggestions

### 🔄 Workflow Visualization
- **Interactive Guides**: Step-by-step OpenFOAM workflow visualization
- **Process Tracking**: Monitor preprocessing, solving, and post-processing stages
- **Dependency Mapping**: Understand file relationships and dependencies
- **Progress Indicators**: Visual feedback on workflow completion

### 👁️ Geometry Viewer *(Coming Soon)*
- **3D Visualization**: Interactive mesh and geometry inspection
- **Quality Analysis**: Visual mesh quality assessment
- **Boundary Condition Mapping**: Color-coded boundary visualization
- **Cross-sections**: Slice and inspect internal geometry

## 🚀 Getting Started

### Prerequisites

Before running FoamPilot, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **OpenFOAM** (version 8 or higher) - for simulation execution
- **Git** - for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhruvhaldar/foampilot.git
   cd foampilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or  
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:8080` to access FoamPilot

### Building for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui for consistent interface elements
- **State Management**: React Query for server state
- **Routing**: React Router for navigation
- **Code Editor**: Monaco Editor integration (planned)
- **3D Graphics**: Three.js for geometry visualization (planned)

## 📁 Project Structure

```
foampilot/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Sidebar.tsx     # Navigation sidebar
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # CSS and design tokens
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
├── docs/                   # Documentation
└── README.md
```

## 🎨 Design System

FoamPilot uses a carefully crafted design system optimized for technical workflows:

- **Color Palette**: Deep blues and teals with orange accents
- **Typography**: Inter for UI, JetBrains Mono for code
- **Dark Theme**: Default professional dark interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: WCAG 2.1 compliance for inclusive design

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# OpenFOAM Installation Path
OPENFOAM_PATH=/opt/openfoam8

# AI Service Configuration (optional)
AI_SERVICE_URL=https://api.your-ai-service.com
AI_API_KEY=your-api-key

# Development Settings
VITE_DEV_MODE=true
```

### OpenFOAM Integration

FoamPilot requires OpenFOAM to be installed and properly configured:

1. **Source OpenFOAM environment**
   ```bash
   source /opt/openfoam8/etc/bashrc
   ```

2. **Verify installation**
   ```bash
   foamExec --help
   ```

## 🤝 Contributing

We welcome contributions to FoamPilot! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use the existing design system components
- Add tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenFOAM Foundation** - For the incredible CFD software
- **React Team** - For the excellent frontend framework  
- **shadcn** - For the beautiful UI component library
- **Tailwind CSS** - For the utility-first CSS framework

<!-- ## 📞 Support

- **Documentation**: [docs.foampilot.com](https://docs.foampilot.com)
- **Issues**: [GitHub Issues](https://github.com/your-username/foampilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/foampilot/discussions)
- **Email**: support@foampilot.com -->

## 🗺️ Roadmap

### v1.0 (Current)
- ✅ Dashboard and navigation
- ✅ Basic case management
- ✅ File editor foundation
- 🔄 Real-time console

### v1.1 (Next Release)
- 🔄 AI parameter optimization
- 🔄 blockMeshDict generator
- 🔄 Advanced file editor
- 🔄 Workflow visualization

### v2.0 (Future)
- 📋 3D geometry viewer
- 📋 Mesh quality analysis
- 📋 Post-processing tools
- 📋 Collaborative features

---

**Built with ❤️ for the CFD community**