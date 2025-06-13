
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HardHat, Loader2, Shield, User, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { user, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('Login attempt for:', email);

    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error details:', error);
      
      let errorMessage = "Please check your credentials and try again.";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Make sure you've signed up first!";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please check your email and confirm your account before signing in.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HardHat className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">BuildPro</h1>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access your construction management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              Demo Accounts - Sign Up Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-3 p-3 bg-orange-100 rounded-md">
              <p className="text-xs text-orange-800 font-medium mb-1">
                ⚠️ Important: Demo accounts must be created first!
              </p>
              <p className="text-xs text-orange-700">
                Before logging in, you need to sign up with these demo emails.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleDemoLogin('admin@buildpro.com', 'demo123')}
              >
                <Shield className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Admin Account</div>
                  <div className="text-xs text-muted-foreground">admin@buildpro.com</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-left"
                onClick={() => handleDemoLogin('worker@buildpro.com', 'demo123')}
              >
                <User className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">Worker Account</div>
                  <div className="text-xs text-muted-foreground">worker@buildpro.com</div>
                </div>
              </Button>
            </div>
            
            <div className="text-xs text-orange-700 space-y-1">
              <p>Password: <code className="bg-orange-100 px-1 rounded">demo123</code></p>
              <p className="font-medium">Steps to use demo accounts:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Click "Sign up here" above</li>
                <li>Create account with demo email</li>
                <li>Return here to sign in</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
