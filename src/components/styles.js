const getStyles = () => `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 30px;
    text-align: center;
  }
  
  .header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  .header p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
  
  .content {
    padding: 40px 30px;
  }
  
  h1 {
    color: #2d3748;
    font-size: 2rem;
    margin-bottom: 1rem;
    border-bottom: 3px solid #667eea;
    padding-bottom: 0.5rem;
  }
  
  h2 {
    color: #4a5568;
    font-size: 1.5rem;
    margin: 2rem 0 1rem 0;
    padding: 10px 15px;
    background: #f7fafc;
    border-left: 4px solid #667eea;
    border-radius: 0 8px 8px 0;
  }
  
  h3 {
    color: #2d3748;
    font-size: 1.2rem;
    margin: 1.5rem 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.5rem 0;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 3px solid #e2e8f0;
    transition: all 0.2s ease;
  }
  
  li:hover {
    background: #edf2f7;
    border-left-color: #667eea;
    transform: translateX(4px);
  }
  
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, transparent, #667eea, transparent);
    margin: 2rem 0;
  }
  
  .footer {
    text-align: center;
    padding: 20px;
    background: #f7fafc;
    color: #718096;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    body {
      padding: 10px;
    }
    
    .header {
      padding: 30px 20px;
    }
    
    .header h1 {
      font-size: 2rem;
    }
    
    .content {
      padding: 30px 20px;
    }
    
    h1 {
      font-size: 1.5rem;
    }
    
    h2 {
      font-size: 1.3rem;
    }
  }
`;

const getErrorStyles = () => `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  .error {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
  h1 { margin-bottom: 20px; }
`;

module.exports = { getStyles, getErrorStyles }; 