import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import { Button } from './components/ui/button';
import { Slider } from './components/ui/slider';

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <div className="flex flex-col items-center justify-center space-y-8">
          <h2 className="text-3xl font-bold">Welcome to CraftyPrep</h2>
          <p className="text-lg text-muted-foreground max-w-2xl text-center">
            Transform your images for laser engraving with our powerful image preparation tool.
          </p>

          {/* Demo of shadcn/ui components */}
          <div className="flex gap-4 flex-wrap justify-center">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
            <Button variant="secondary">Documentation</Button>
          </div>

          <div className="w-full max-w-md space-y-4">
            <label className="text-sm font-medium">Brightness Adjustment</label>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </div>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
