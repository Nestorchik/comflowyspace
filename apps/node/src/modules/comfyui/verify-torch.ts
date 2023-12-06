import { execa } from "execa";
import { CONDA_ENV_NAME } from "../config-manager";
const macPythonCode = `
import torch
if torch.backends.mps.is_available():
    mps_device = torch.device("mps")
    x = torch.ones(1, device=mps_device)
    print (x)
else:
    print ("failed")
`
const otherPythonCode = `
import torch
if torch.cuda.is_available():
    print("success")
else:
    print("failed")
`
const expectedMacOutput = `tensor([1.], device='mps:0')`;
const expectedOtherOutput = "success";
const isMac = process.platform === 'darwin';
const pythonCode = isMac ? macPythonCode : otherPythonCode;
const expectedOutput = isMac ? expectedMacOutput : expectedOtherOutput;

export async function verifyIsTorchInstalled(): Promise<boolean> {
    try {
        // 使用 execa 执行 conda run 命令，切换到指定的 Conda 环境并运行 Python 代码
        const { stdout } = await execa('conda', ['run', '-n', CONDA_ENV_NAME, 'python', '-c', pythonCode], { shell: true });
        // 检查执行结果是否符合预期
        if (stdout.trim() === expectedOutput) {
            console.log('Torch installation verification successful.');
            return true;
        } else {
            console.error('Torch installation verification failed. Unexpected output.');
            return false;
        }
    } catch (error) {
        console.error('Torch installation verification failed. Error:', error);
        return false;
    }
}