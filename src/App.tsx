import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { FileUploadComponent } from './components/FileUploadComponent';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Welcome to CraftyPrep</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform your images for laser engraving with our powerful image preparation tool.
            </p>
          </div>

          <FileUploadComponent />
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
