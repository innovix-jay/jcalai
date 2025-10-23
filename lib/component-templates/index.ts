// Pre-built component templates for JCAL.ai

export interface ComponentTemplate {
  id: string;
  name: string;
  category: 'forms' | 'navigation' | 'data-display' | 'feedback' | 'layout';
  description: string;
  code: string;
  thumbnail?: string;
  dependencies?: string[];
}

export const componentLibrary: ComponentTemplate[] = [
  // FORMS
  {
    id: 'form-input',
    name: 'Text Input',
    category: 'forms',
    description: 'A styled text input with label and error message',
    code: `export function TextInput({ label, error, ...props }: any) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}`
  },
  {
    id: 'form-button',
    name: 'Button',
    category: 'forms',
    description: 'A customizable button component',
    code: `export function Button({ variant = 'primary', children, ...props }: any) {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  
  return (
    <button
      {...props}
      className={\`px-4 py-2 rounded-lg font-medium transition-colors \${variants[variant]}\`}
    >
      {children}
    </button>
  );
}`
  },

  // NAVIGATION
  {
    id: 'nav-header',
    name: 'Header',
    category: 'navigation',
    description: 'A responsive header with logo and nav links',
    code: `export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Logo</div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}`
  },
  {
    id: 'nav-sidebar',
    name: 'Sidebar',
    category: 'navigation',
    description: 'A sidebar navigation menu',
    code: `export function Sidebar() {
  const links = [
    { name: 'Dashboard', icon: '📊', href: '#' },
    { name: 'Projects', icon: '📁', href: '#' },
    { name: 'Settings', icon: '⚙️', href: '#' }
  ];
  
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">Menu</h2>
      <nav className="space-y-2">
        {links.map(link => (
          <a
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}`
  },

  // DATA DISPLAY
  {
    id: 'data-card',
    name: 'Card',
    category: 'data-display',
    description: 'A content card with header and body',
    code: `export function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}`
  },
  {
    id: 'data-table',
    name: 'Table',
    category: 'data-display',
    description: 'A responsive data table',
    code: `export function Table({ columns, data }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col: string) => (
              <th key={col} className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
              {Object.values(row).map((cell: any, j: number) => (
                <td key={j} className="px-6 py-4 text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`
  },

  // FEEDBACK
  {
    id: 'feedback-alert',
    name: 'Alert',
    category: 'feedback',
    description: 'An alert message component',
    code: `export function Alert({ type = 'info', title, message }: any) {
  const types = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  };
  
  return (
    <div className={\`p-4 rounded-lg border \${types[type]}\`}>
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <p className="text-sm">{message}</p>
    </div>
  );
}`
  },
  {
    id: 'feedback-modal',
    name: 'Modal',
    category: 'feedback',
    description: 'A modal dialog',
    code: `export function Modal({ isOpen, onClose, title, children }: any) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}`
  },

  // LAYOUT
  {
    id: 'layout-hero',
    name: 'Hero Section',
    category: 'layout',
    description: 'A hero section with title and CTA',
    code: `export function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Your App</h1>
        <p className="text-xl mb-8">Build amazing things with JCAL.ai</p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Get Started
        </button>
      </div>
    </section>
  );
}`
  },
  {
    id: 'layout-footer',
    name: 'Footer',
    category: 'layout',
    description: 'A page footer',
    code: `export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Docs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}`
  }
];

export function getComponentsByCategory(category: ComponentTemplate['category']) {
  return componentLibrary.filter(c => c.category === category);
}

export function getComponentById(id: string) {
  return componentLibrary.find(c => c.id === id);
}
