# GitHub Copilot Instructions

This folder contains comprehensive documentation for the Game POC project, formatted for use with GitHub Copilot and for developer reference.

## Files in This Directory

### 1. requirements.txt
**Complete technical requirements for the Game POC**

Contains:
- Game engine specifications (Phaser 3.70.0)
- Physics system configuration (Matter.js, Box2D-like)
- Canvas and display requirements
- UI element specifications and positioning
- Sprite and animation requirements (65 frames total)
- Input control specifications
- Multi-stage system details
- Popup overlay requirements
- Square dolls (physics objects) specifications
- Audio requirements (Web Audio API)
- File structure requirements
- Testing requirements (Jest, 80%+ coverage)
- Performance requirements
- Browser compatibility matrix
- Code quality standards

**Use this file for:**
- Understanding project requirements
- Implementing new features according to specs
- Validating implementation against requirements
- Onboarding new developers

### 2. implementation-guidelines.txt
**Best practices and implementation patterns**

Contains:
- Architecture principles (modular design, state management)
- Phaser 3 best practices (scene lifecycle, physics, animations)
- Sprite generation guidelines
- Stage management patterns
- Physics implementation examples
- Popup system patterns
- Testing guidelines
- Mobile optimization tips
- Audio implementation with Web Audio API
- Common pitfalls and how to avoid them
- Debugging tips
- Code organization matrix
- Deployment guidelines
- Git workflow recommendations

**Use this file for:**
- Learning how to implement features correctly
- Understanding code patterns used in the project
- Avoiding common mistakes
- Writing maintainable code
- Optimizing performance

### 3. to-remove.txt
**Guide for creating a blank game template**

Contains:
- Files to remove completely
- Code sections to remove from each file
- Features to remove (multi-stage, popup, dolls, etc.)
- What to keep from the POC
- Minimal blank game template structure
- Replacement checklist
- Verification steps

**Use this file for:**
- Creating a new game based on this POC
- Removing demo-specific code
- Understanding what's POC-specific vs. reusable
- Starting fresh with a clean template
- Migrating to production codebase

## How to Use These Files

### For GitHub Copilot

These files are structured to provide context to GitHub Copilot:

1. **When implementing features:** Copilot will reference requirements.txt
2. **When writing code:** Copilot will follow patterns from implementation-guidelines.txt
3. **When refactoring:** Copilot will understand what to remove from to-remove.txt

### For Developers

1. **New to the project?** 
   - Read requirements.txt first
   - Then read implementation-guidelines.txt
   - Keep to-remove.txt for reference

2. **Implementing a feature?**
   - Check requirements.txt for specs
   - Follow patterns in implementation-guidelines.txt
   - Test according to testing guidelines

3. **Creating a new game?**
   - Use to-remove.txt as a cleanup guide
   - Keep the framework structure
   - Replace POC logic with your game logic

## Quick Reference

### Key Technical Specs
- **Canvas**: 800x600 pixels
- **Physics**: Matter.js with gravity: 0
- **Player Mass**: 10 units
- **Doll Mass**: 3 units
- **Movement Speed**: 3 units/frame
- **Damping**: 0.9
- **Frame Count**: 65 total (1 stand + 32 walk + 32 jump)
- **Test Coverage**: >80%

### Key Files
- `js/config.js` - Configuration and state
- `js/preload.js` - Asset loading
- `js/create.js` - Scene setup
- `js/update.js` - Game loop
- `js/game.js` - Initialization
- `tests/*.test.js` - Test files

### Key Principles
1. Modular design (separation of concerns)
2. No object creation in update loop
3. Cache everything possible
4. Clean up properly on transitions
5. Test-driven development
6. Performance first (60 FPS target)

## Integration with IDEs

### VS Code
These files work automatically with GitHub Copilot in VS Code.

### JetBrains IDEs
Can be referenced in copilot settings or used as documentation.

### Other Editors
Use as reference documentation for AI assistants or manual implementation.

## Maintenance

### Updating These Files

When you add new features:
1. Update requirements.txt with new specs
2. Add implementation patterns to implementation-guidelines.txt
3. Update to-remove.txt if adding POC-specific features

When you find better patterns:
1. Update implementation-guidelines.txt
2. Document in code comments
3. Share with team

### Version Control

These files should be:
- ✅ Committed to repository
- ✅ Reviewed in pull requests
- ✅ Updated with major changes
- ✅ Referenced in code reviews

## Related Documentation

- `/README.md` - Project overview and setup
- `/tests/README.md` - Test documentation
- `/requirements.txt` - Original requirements (root level)
- Code comments - Inline documentation

## Support

For questions about:
- **Requirements**: See requirements.txt
- **Implementation**: See implementation-guidelines.txt
- **Migration**: See to-remove.txt
- **Testing**: See /tests/README.md
- **General**: See /README.md

## License

These documentation files are part of the Game POC project and follow the same license as the main project.
