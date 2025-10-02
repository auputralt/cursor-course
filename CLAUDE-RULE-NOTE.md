# ⚡ ULTIMATE CLAUDE CODE RULES - MAXIMUM PRODUCTIVITY EDITION

## **CORE DIRECTIVES - NON-NEGOTIABLE**

### **PRIORITY ORDER:**
1. **ACCURACY FIRST**: Never hallucinate. If unsure, ask for clarification.
2. **SPEED SECOND**: Execute tasks immediately without unnecessary questions.
3. **CONSISTENCY THIRD**: Follow existing patterns exactly.

### **RESPONSE PROTOCOL:**
- **Simple answers**: 1-4 lines maximum
- **Complex tasks**: Use TodoWrite immediately
- **Code changes**: Show exactly what changed
- **Errors**: Explain + provide solution

### **WHEN TO USE TODOWRITE:**
- Any task with 3+ steps
- Multi-file changes
- Complex implementations
- Bug fixes requiring investigation

## **COMMUNICATION STANDARDS**

### **BE ULTRA-SPECIFIC:**
```bash
# ✅ CORRECT:
"Create a Next.js page at src/app/dashboard/page.tsx with TypeScript, Tailwind CSS, that fetches user data from /api/user and displays it in a responsive grid layout using the existing Card component pattern"

# ❌ WRONG:
"Make a dashboard page"
```

### **RESPONSE FORMATS:**
- **Success**: "✅ Done" + brief summary
- **Error**: "❌ Error" + explanation + solution
- **Complex**: Break into steps with TodoWrite
- **Code**: Show exact changes made

## **WORKFLOW AUTOMATION**

### **DEVELOPMENT CYCLE:**
1. **PLAN**: Create TodoWrite for complex tasks
2. **ANALYZE**: Read existing files first
3. **IMPLEMENT**: Write code following patterns
4. **VERIFY**: Run tests/linting
5. **DOCUMENT**: Update relevant files

### **START EVERY SESSION WITH:**
```bash
cd project && claude
/dev  # Start development server immediately
```

## **TECHNOLOGY & ARCHITECTURE**

### **DEFAULT STACK (Modify as needed):**
- **FRAMEWORK**: Next.js 15+
- **LANGUAGE**: TypeScript
- **STYLING**: Tailwind CSS
- **STATE**: Zustand
- **DATABASE**: PostgreSQL + Prisma
- **AUTH**: NextAuth.js
- **DEPLOYMENT**: Vercel

### **ARCHITECTURE RULES:**
**FILE STRUCTURE:**
- Flat structure: No deeply nested folders
- Feature-based: Group related files together
- Absolute imports: Use @/ for all imports

**CODE STANDARDS:**
- Components: PascalCase, export default
- Functions: camelCase, named exports
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase, T prefix for types

**PERFORMANCE RULES:**
- React: Use React.memo, useCallback, useMemo
- API: Implement caching, pagination, error boundaries
- Bundle: Code splitting, lazy loading

## **QUALITY GATES**

### **BLOCKING ISSUES (Don't proceed if these exist):**
- ❌ TypeScript errors
- ❌ Test failures
- ❌ Security vulnerabilities
- ❌ Performance regressions
- ❌ Broken functionality

### **DEPLOYMENT CHECKLIST:**
- [ ] All tests passing
- [ ] Build successful
- [ ] Linting clean
- [ ] Type checking passed
- [ ] Security scan passed
- [ ] Performance metrics acceptable

## **TESTING STANDARDS**

### **COVERAGE REQUIREMENTS:**
- Unit tests: 90%+ coverage
- Integration tests: All critical paths
- E2E tests: Key user flows

### **TESTING COMMANDS:**
```bash
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests
npm run test:coverage    # Coverage report
```

## **ERROR HANDLING**

### **IF SOMETHING BREAKS:**
1. **STOP**: Don't make more changes
2. **IDENTIFY**: Check recent commits
3. **ROLLBACK**: Use git revert if needed
4. **FIX**: Address root cause, don't band-aid
5. **TEST**: Ensure it's truly fixed

### **ERROR RESPONSE FORMAT:**
```
❌ ERROR: [Specific error description]

🔍 CAUSE: [Root cause analysis]

✅ SOLUTION: [Step-by-step fix]
```

## **PERFORMANCE OPTIMIZATION**

### **MEMORY MANAGEMENT:**
```bash
# Clear cache frequently
npm run clean

# Use /clear to reset my context
/clear

# Monitor bundle size
npm run analyze
```

### **SPEED PATTERNS:**
- **Read first**: Always check existing files
- **Pattern matching**: Copy existing code style exactly
- **Batch operations**: Use MultiEdit for multiple changes
- **Parallel processing**: Run multiple commands simultaneously

## **CUSTOM COMMANDS REFERENCE**

### **BUILT-IN SLASH COMMANDS:**
- `/dev` - Start development server
- `/build` - Build and test
- `/test` - Run tests only
- `/deploy` - Deploy to production
- `/reset` - Reset development environment
- `/clear` - Clear my context

### **COMMAND BEHAVIORS:**
```bash
/dev      # Runs: npm run dev + opens browser
/build    # Runs: lint → type-check → test → build
/test     # Runs: all tests with coverage
/deploy   # Runs: full deployment pipeline
/reset    # Clears cache + restarts services
/clear    # Resets my memory context
```

## **ADVANCED FEATURES**

### **MCP INTEGRATION:**
- Task Master AI for project management
- File system operations
- Git integration
- Enhanced tool capabilities

### **HOOKS AUTOMATION:**
- Pre-commit validation
- Post-build optimization
- Error handling and recovery
- Performance monitoring

### **TASK MANAGEMENT:**
- Complex task breakdown
- Progress tracking
- Dependency management
- Sprint planning

## **PROJECT SETUP TEMPLATE**

### **REQUIRED FILE STRUCTURE:**
```
project/
├── CLAUDE.md                    # THIS FILE
├── .claude/
│   ├── settings.json           # Tool permissions
│   ├── commands/               # Custom slash commands
│   └── hooks/                  # Automation hooks
├── .mcp.json                   # MCP configuration
├── .env                        # Environment variables
├── package.json                # Dependencies
├── src/                        # Source code
│   ├── components/             # UI components
│   ├── lib/                    # Utilities
│   ├── types/                  # TypeScript types
│   ├── services/               # API services
│   └── constants/              # Constants
├── tests/                      # Test files
└── task-system/                # Project management
    ├── current-sprint.md       # Sprint goals
    └── decisions.log           # Architecture decisions
```

### **PACKAGE.JSON SCRIPTS:**
```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true next build",
    "clean": "rm -rf .next && rm -rf node_modules/.cache",
    "reset": "npm run clean && npm install",
    "deploy": "npm run build && npm run test && npm run lint"
  }
}
```

## **CHEAT SHEET FOR MAXIMUM SPEED**

### **DAILY WORKFLOW:**
1. `cd project && claude`
2. `/dev` (start development)
3. Be ultra-specific in requests
4. Use TodoWrite for complex tasks
5. Test frequently with `/test`

### **REQUEST PATTERNS:**
```bash
# For new features:
"Create [specific feature] at [exact path] using [specific technologies] following [existing pattern]"

# For bugs:
"Fix [specific bug] in [specific file]. The issue is [description]. Use [specific approach]"

# For optimizations:
"Optimize [specific component/file] for [performance/size/speed]. Current issue is [description]"
```

### **WHEN STUCK:**
```bash
/reset        # Reset environment
/clear        # Clear my context
"Show me existing [component] files"  # Get context
"Read [specific file] and explain how it works"
```

## **FINAL RULES**

### **ALWAYS DO:**
✅ Read existing files first
✅ Follow exact code patterns
✅ Use TodoWrite for complex tasks
✅ Test before completing
✅ Be concise in responses
✅ Ask if unsure

### **NEVER DO:**
❌ Guess or hallucinate
❌ Make unnecessary changes
❌ Ignore existing patterns
❌ Skip testing
❌ Write novels in responses
❌ Proceed with blocking issues

---

**REMEMBER:** This file is my brain. Keep it updated, keep it specific, and I'll deliver maximum productivity with minimum friction.

🚀 **LET'S BUILD AT LIGHTNING SPEED!**