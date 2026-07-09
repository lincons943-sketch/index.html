// ============================================
// GAMEFORGE AI - INTERACTIVE SCRIPT
// ============================================

// Daily Limit System
const DAILY_LIMIT = 100;
let currentUsage = 80;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDailyLimit();
    setupNavigation();
    setupToolModals();
    animateOnScroll();
});

// ============================================
// DAILY LIMIT MANAGEMENT
// ============================================

function updateDailyLimit() {
    const percentage = (currentUsage / DAILY_LIMIT) * 100;
    
    // Update main limit fill
    const mainLimitFill = document.getElementById('mainLimitFill');
    if (mainLimitFill) {
        mainLimitFill.style.width = percentage + '%';
    }
    
    // Update main counter
    const mainCounter = document.getElementById('mainLimitCounter');
    if (mainCounter) {
        mainCounter.textContent = currentUsage;
    }
    
    // Update nav limit fill
    const navLimitFill = document.getElementById('navLimitFill');
    if (navLimitFill) {
        navLimitFill.style.width = percentage + '%';
    }
    
    // Update nav limit text
    const navLimitText = document.getElementById('navLimitText');
    if (navLimitText) {
        navLimitText.textContent = currentUsage + '/' + DAILY_LIMIT;
    }
    
    // Change color based on usage
    if (percentage < 50) {
        mainLimitFill?.style.background = 'linear-gradient(90deg, var(--neon-green), var(--neon-cyan))';
    } else if (percentage < 80) {
        mainLimitFill?.style.background = 'linear-gradient(90deg, var(--neon-cyan), var(--neon-blue))';
    } else if (percentage < 95) {
        mainLimitFill?.style.background = 'linear-gradient(90deg, var(--neon-purple), var(--neon-blue))';
    } else {
        mainLimitFill?.style.background = 'linear-gradient(90deg, var(--neon-pink), var(--neon-purple))';
    }
}

function useCredits(amount) {
    if (currentUsage + amount <= DAILY_LIMIT) {
        currentUsage += amount;
        updateDailyLimit();
        showNotification(`Used ${amount} credits! (${currentUsage}/${DAILY_LIMIT})`);
        return true;
    } else {
        showNotification('⚠️ Daily limit exceeded! Upgrade to Premium for unlimited usage.', 'error');
        return false;
    }
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get section ID and scroll to it
            const sectionId = link.getAttribute('href');
            const section = document.querySelector(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// ============================================
// TOOL MODALS
// ============================================

const toolContent = {
    'script-gen': {
        title: 'Script Generator',
        icon: '📝',
        content: `
            <h2>📝 Script Generator</h2>
            <p>Generate Lua scripts for Roblox and code for other game engines powered by AI.</p>
            <br>
            <div style="background: rgba(0, 212, 255, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-blue); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">What would you like to generate?</h3>
                <textarea id="scriptPrompt" placeholder="E.g., Create a player movement script with WASD controls..." style="width: 100%; height: 100px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-blue); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; font-family: monospace; resize: vertical;"></textarea>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <select id="engineSelect" style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-cyan); background: rgba(10, 14, 39, 0.8); color: #e0e7ff;">
                        <option>Roblox (Lua)</option>
                        <option>Unity (C#)</option>
                        <option>Godot (GDScript)</option>
                        <option>Unreal (C++)</option>
                    </select>
                    <button class="btn btn-primary" onclick="generateScript()">Generate Script</button>
                </div>
            </div>
            <div id="scriptOutput" style="display: none; background: rgba(0, 255, 0, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-green); margin-top: 15px;">
                <h3 style="color: var(--neon-green); margin-top: 0;">Generated Script:</h3>
                <pre id="scriptCode" style="overflow-x: auto; color: var(--neon-green); font-size: 12px; line-height: 1.4;"></pre>
            </div>
        `
    },
    'model-assistant': {
        title: 'Model Assistant',
        icon: '🎨',
        content: `
            <h2>🎨 Model Assistant</h2>
            <p>Create 3D props, characters, and textures from text prompts.</p>
            <br>
            <div style="background: rgba(217, 70, 239, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-purple); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Describe your model:</h3>
                <textarea id="modelPrompt" placeholder="E.g., A futuristic robot with glowing blue eyes, metallic gray body..." style="width: 100%; height: 100px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-purple); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; resize: vertical;"></textarea>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <select id="modelType" style="flex: 1; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-purple); background: rgba(10, 14, 39, 0.8); color: #e0e7ff;">
                        <option>Character</option>
                        <option>Prop</option>
                        <option>Environment</option>
                        <option>Vehicle</option>
                    </select>
                    <button class="btn btn-primary" onclick="generateModel()">Generate Model</button>
                </div>
            </div>
            <div id="modelOutput" style="display: none; background: rgba(217, 70, 239, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-purple); margin-top: 15px;">
                <h3 style="color: var(--neon-purple); margin-top: 0;">Model Generated!</h3>
                <p id="modelResult" style="color: #e0e7ff;"></p>
                <button class="btn btn-secondary" style="margin-top: 10px;">Download Model</button>
            </div>
        `
    },
    'builder': {
        title: 'Building Tool',
        icon: '🏗️',
        content: `
            <h2>🏗️ Building Tool</h2>
            <p>Generate maps, terrain, and structures instantly.</p>
            <br>
            <div style="background: rgba(6, 182, 212, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-cyan); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Describe your world:</h3>
                <textarea id="builderPrompt" placeholder="E.g., A futuristic neon city with tall skyscrapers, flying cars, and holographic signs..." style="width: 100%; height: 100px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-cyan); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; resize: vertical;"></textarea>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <input type="range" id="mapSize" min="64" max="1024" value="256" style="flex: 1;">
                    <span id="mapSizeDisplay" style="color: #e0e7ff; min-width: 50px;">256</span>
                    <button class="btn btn-primary" onclick="generateMap()">Generate Map</button>
                </div>
            </div>
            <div id="builderOutput" style="display: none; background: rgba(6, 182, 212, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-cyan); margin-top: 15px;">
                <h3 style="color: var(--neon-cyan); margin-top: 0;">Map Generated!</h3>
                <p id="builderResult" style="color: #e0e7ff;"></p>
                <button class="btn btn-secondary" style="margin-top: 10px;">Export Map</button>
            </div>
        `
    },
    'debugger': {
        title: 'Code Debugger',
        icon: '🐛',
        content: `
            <h2>🐛 Code Debugger</h2>
            <p>AI-powered debugger that explains errors and suggests fixes.</p>
            <br>
            <div style="background: rgba(0, 255, 0, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-green); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Paste your code or error:</h3>
                <textarea id="debugCode" placeholder="Paste error message or code here..." style="width: 100%; height: 120px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-green); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; font-family: monospace; resize: vertical;"></textarea>
                <button class="btn btn-primary" style="margin-top: 15px;" onclick="debugCode()">Analyze & Fix</button>
            </div>
            <div id="debugOutput" style="display: none; background: rgba(0, 255, 0, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-green); margin-top: 15px;">
                <h3 style="color: var(--neon-green); margin-top: 0;">Analysis Result:</h3>
                <div id="debugResult" style="color: #e0e7ff; line-height: 1.6;"></div>
            </div>
        `
    },
    'vfx': {
        title: 'VFX Creator',
        icon: '✨',
        content: `
            <h2>✨ VFX Creator</h2>
            <p>Create particle effects, animations, and stunning UI elements.</p>
            <br>
            <div style="background: rgba(255, 0, 110, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-pink); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">What VFX would you like?</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
                    <button class="vfx-preset" onclick="selectVFX('explosion')">💥 Explosion</button>
                    <button class="vfx-preset" onclick="selectVFX('magic')">🪄 Magic Spell</button>
                    <button class="vfx-preset" onclick="selectVFX('heal')">💚 Heal Effect</button>
                    <button class="vfx-preset" onclick="selectVFX('teleport')">🌀 Teleport</button>
                </div>
                <textarea id="vfxPrompt" placeholder="Describe your custom effect..." style="width: 100%; height: 80px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-pink); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; resize: vertical;"></textarea>
                <button class="btn btn-primary" style="margin-top: 15px; width: 100%;" onclick="generateVFX()">Create VFX</button>
            </div>
            <div id="vfxOutput" style="display: none; background: rgba(255, 0, 110, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-pink); margin-top: 15px;">
                <h3 style="color: var(--neon-pink); margin-top: 0;">VFX Created!</h3>
                <p id="vfxResult" style="color: #e0e7ff;"></p>
                <button class="btn btn-secondary" style="margin-top: 10px;">Download VFX</button>
            </div>
        `
    },
    'ai-mentor': {
        title: 'AI Mentor',
        icon: '🤖',
        content: `
            <h2>🤖 AI Mentor</h2>
            <p>Learn game development step by step with interactive tutorials.</p>
            <br>
            <div style="background: rgba(6, 182, 212, 0.1); padding: 20px; border-radius: 10px; border-left: 3px solid var(--neon-cyan); margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Ask your AI Mentor:</h3>
                <textarea id="mentorQuestion" placeholder="E.g., How do I implement a jump mechanic? How do I optimize my game?" style="width: 100%; height: 100px; padding: 10px; border-radius: 5px; border: 1px solid var(--neon-cyan); background: rgba(10, 14, 39, 0.8); color: #e0e7ff; resize: vertical;"></textarea>
                <button class="btn btn-primary" style="margin-top: 15px; width: 100%;" onclick="askMentor()">Get Answer</button>
            </div>
            <div id="mentorOutput" style="display: none; background: rgba(6, 182, 212, 0.05); padding: 15px; border-radius: 5px; border: 1px solid var(--neon-cyan); margin-top: 15px;">
                <h3 style="color: var(--neon-cyan); margin-top: 0;">AI Mentor's Answer:</h3>
                <div id="mentorResult" style="color: #e0e7ff; line-height: 1.8;"></div>
            </div>
        `
    }
};

function setupToolModals() {
    // Add CSS for VFX preset buttons
    const style = document.createElement('style');
    style.textContent = `
        .vfx-preset {
            padding: 10px;
            border: 1px solid var(--neon-pink);
            background: rgba(255, 0, 110, 0.1);
            color: var(--neon-pink);
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
        }
        .vfx-preset:hover {
            background: rgba(255, 0, 110, 0.3);
            box-shadow: 0 0 10px rgba(255, 0, 110, 0.3);
        }
        .vfx-preset.selected {
            background: rgba(255, 0, 110, 0.5);
            box-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
        }
    `;
    document.head.appendChild(style);
}

function openTool(toolId) {
    const tool = toolContent[toolId];
    if (!tool) return;
    
    const modal = document.getElementById('toolModal');
    const toolContentDiv = document.getElementById('toolContent');
    
    toolContentDiv.innerHTML = tool.content;
    modal.style.display = 'block';
    
    // Add event listener for map size slider
    const mapSizeSlider = document.getElementById('mapSize');
    if (mapSizeSlider) {
        mapSizeSlider.addEventListener('input', (e) => {
            document.getElementById('mapSizeDisplay').textContent = e.target.value;
        });
    }
}

function closeTool() {
    const modal = document.getElementById('toolModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('toolModal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// ============================================
// TOOL FUNCTIONS
// ============================================

function generateScript() {
    const prompt = document.getElementById('scriptPrompt').value;
    const engine = document.getElementById('engineSelect').value;
    
    if (!prompt) {
        showNotification('Please enter a script description!', 'error');
        return;
    }
    
    if (!useCredits(10)) return;
    
    // Simulate API call
    setTimeout(() => {
        const scriptExamples = {
            'Roblox (Lua)': `-- Movement Script for Roblox
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local rootPart = character:WaitForChild("HumanoidRootPart")

local speed = 20
local jumping = false

local UserInputService = game:GetService("UserInputService")

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    
    if input.KeyCode == Enum.KeyCode.W then
        rootPart.Velocity = rootPart.Velocity + rootPart.CFrame.LookVector * speed
    end
end)`,
            'Unity (C#)': `using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float speed = 5f;
    public float jumpForce = 5f;
    private Rigidbody rb;
    
    void Start() => rb = GetComponent<Rigidbody>();
    
    void Update()
    {
        float moveX = Input.GetAxis("Horizontal");
        float moveZ = Input.GetAxis("Vertical");
        
        Vector3 move = transform.right * moveX + transform.forward * moveZ;
        rb.velocity = new Vector3(move.x * speed, rb.velocity.y, move.z * speed);
        
        if (Input.GetKeyDown(KeyCode.Space))
            rb.velocity = new Vector3(rb.velocity.x, jumpForce, rb.velocity.z);
    }
}`,
            'Godot (GDScript)': `extends KinematicBody

export var speed = 5.0
export var jump_force = 10.0

var velocity = Vector3.ZERO

func _physics_process(delta):
    var input = Vector3.ZERO
    input.x = Input.get_action_strength("ui_right") - Input.get_action_strength("ui_left")
    input.z = Input.get_action_strength("ui_down") - Input.get_action_strength("ui_up")
    
    if input.length() > 0:
        velocity.x = input.normalized().x * speed
        velocity.z = input.normalized().z * speed
    else:
        velocity.x = 0
        velocity.z = 0
    
    if is_on_floor() and Input.is_action_just_pressed("ui_select"):
        velocity.y = jump_force
    else:
        velocity.y -= 9.8 * delta
    
    velocity = move_and_slide(velocity, Vector3.UP)`,
            'Unreal (C++)': `void APlayerCharacter::BeginPlay()
{
    Super::BeginPlay();
}

void APlayerCharacter::Tick(float DeltaTime)
{
    Super::Tick(DeltaTime);
    
    float MoveForward = 0.0f;
    float MoveRight = 0.0f;
    
    if (Controller)
    {
        if (InputComponent)
        {
            MoveForward = GetInputAxisValue(FName("MoveForward"));
            MoveRight = GetInputAxisValue(FName("MoveRight"));
            
            AddMovementInput(GetActorForwardVector(), MoveForward);
            AddMovementInput(GetActorRightVector(), MoveRight);
        }
    }
}`
        };
        
        const code = scriptExamples[engine];
        document.getElementById('scriptOutput').style.display = 'block';
        document.getElementById('scriptCode').textContent = code;
        showNotification('✅ Script generated successfully!');
    }, 500);
}

function generateModel() {
    const prompt = document.getElementById('modelPrompt').value;
    const type = document.getElementById('modelType').value;
    
    if (!prompt) {
        showNotification('Please describe your model!', 'error');
        return;
    }
    
    if (!useCredits(15)) return;
    
    setTimeout(() => {
        document.getElementById('modelOutput').style.display = 'block';
        document.getElementById('modelResult').textContent = 
            `Your ${type.toLowerCase()} model has been generated based on: "${prompt}"\n\nModel Details:\n` +
            `• Format: .obj, .fbx, .gltf\n` +
            `• Polygons: 45,000\n` +
            `• Texture Resolution: 4K\n` +
            `• Ready for: Roblox, Unity, Godot, Unreal`;
        showNotification('✅ 3D model generated!');
    }, 800);
}

function generateMap() {
    const prompt = document.getElementById('builderPrompt').value;
    const size = document.getElementById('mapSize').value;
    
    if (!prompt) {
        showNotification('Please describe your world!', 'error');
        return;
    }
    
    if (!useCredits(20)) return;
    
    setTimeout(() => {
        document.getElementById('builderOutput').style.display = 'block';
        document.getElementById('builderResult').textContent = 
            `Your ${size}x${size} map has been generated!\n\n` +
            `Map Details:\n` +
            `• Size: ${size}x${size} studs\n` +
            `• Terrain Type: Mixed\n` +
            `• Structures: 50+\n` +
            `• Spawn Points: 10\n` +
            `• Generation Time: 2.3s`;
        showNotification('✅ Map generated successfully!');
    }, 1200);
}

function debugCode() {
    const code = document.getElementById('debugCode').value;
    
    if (!code) {
        showNotification('Please paste code or an error message!', 'error');
        return;
    }
    
    if (!useCredits(8)) return;
    
    setTimeout(() => {
        document.getElementById('debugOutput').style.display = 'block';
        document.getElementById('debugResult').innerHTML = 
            `<strong>🔍 Issue Found:</strong><br>` +
            `Variable scope error detected<br><br>` +
            `<strong>💡 Solution:</strong><br>` +
            `Define variables before using them. Make sure all variables are declared with proper scope.<br><br>` +
            `<strong>✨ Suggestions:</strong><br>` +
            `• Add type checking for parameters<br>` +
            `• Initialize variables at the start of the function<br>` +
            `• Use meaningful variable names for better debugging`;
        showNotification('✅ Code analysis complete!');
    }, 600);
}

function generateVFX() {
    const prompt = document.getElementById('vfxPrompt').value;
    
    if (!prompt) {
        showNotification('Please describe your VFX!', 'error');
        return;
    }
    
    if (!useCredits(12)) return;
    
    setTimeout(() => {
        document.getElementById('vfxOutput').style.display = 'block';
        document.getElementById('vfxResult').textContent = 
            `Your VFX has been created!\n\n` +
            `Effect Details:\n` +
            `• Particle Count: 5,000\n` +
            `• Duration: 2.5s\n` +
            `• Performance: Optimized\n` +
            `• Formats: Roblox, Unity, Godot, Unreal\n` +
            `• Color Scheme: Customizable`;
        showNotification('✅ VFX created successfully!');
    }, 700);
}

function selectVFX(type) {
    const buttons = document.querySelectorAll('.vfx-preset');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    document.getElementById('vfxPrompt').value = `${type} effect with neon colors and advanced particles`;
}

function askMentor() {
    const question = document.getElementById('mentorQuestion').value;
    
    if (!question) {
        showNotification('Please ask a question!', 'error');
        return;
    }
    
    if (!useCredits(5)) return;
    
    setTimeout(() => {
        document.getElementById('mentorOutput').style.display = 'block';
        document.getElementById('mentorResult').innerHTML = 
            `<strong>Great question!</strong><br><br>` +
            `To implement a jump mechanic in most game engines, you need to:<br><br>` +
            `1. <strong>Detect Jump Input:</strong> Check when the player presses the jump key<br>` +
            `2. <strong>Apply Upward Force:</strong> Add velocity or force to move the character up<br>` +
            `3. <strong>Add Gravity:</strong> Ensure gravity pulls the character back down<br>` +
            `4. <strong>Ground Detection:</strong> Only allow jumping when on the ground<br><br>` +
            `<strong>Pro Tips:</strong><br>` +
            `• Use a raycast to detect ground<br>` +
            `• Add air control for better feel<br>` +
            `• Implement jump cooldown to prevent spam<br>` +
            `• Add sound effects for feedback<br><br>` +
            `Would you like me to generate sample code for your engine?`;
        showNotification('✅ AI Mentor answered your question!');
    }, 900);
}

// ============================================
// PROJECT MANAGEMENT
// ============================================

function createNewProject() {
    const projectName = prompt('Enter project name:');
    if (projectName) {
        showNotification(`✅ Project "${projectName}" created!`);
    }
}

function openProject(projectId) {
    showNotification(`Opening project: ${projectId}`);
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? 'rgba(255, 0, 110, 0.9)' : 'rgba(0, 212, 255, 0.9)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 0 20px ${type === 'error' ? 'rgba(255, 0, 110, 0.5)' : 'rgba(0, 212, 255, 0.5)'};
        z-index: 10000;
        animation: slideIn 0.3s ease;
        border: 1px solid ${type === 'error' ? 'var(--neon-pink)' : 'var(--neon-blue)'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations to page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// SCROLL ANIMATIONS
// ============================================

function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-card, .tool-card, .project-card, .learning-card').forEach(el => {
        observer.observe(el);
    });
}

// Update active nav link on load
updateActiveNavLink();

console.log('🎮 GameForge AI loaded successfully! Start creating amazing games!');
