import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command: string, description: string) {
  try {
    console.log(`\n🔄 ${description}...`);
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✅ ${description} completed!`);
    return true;
  } catch (error: any) {
    if (error.stdout) console.log(error.stdout);
    if (error.stderr && !error.stderr.includes('already has')) {
      console.error(`❌ Error: ${error.stderr}`);
      return false;
    }
    // If error is about existing data, it's okay
    if (error.stderr && error.stderr.includes('already has')) {
      console.log(`⚠️  ${description} skipped (data already exists)`);
      return true;
    }
    return false;
  }
}

async function seedAll() {
  console.log('🌱 Starting to seed all data...\n');

  const commands = [
    {
      command: 'npm run seed:movies',
      description: 'Seeding movies',
    },
    {
      command: 'npm run seed:cinemas',
      description: 'Seeding cinemas',
    },
    {
      command: 'npm run seed:schedules',
      description: 'Seeding schedules',
    },
    {
      command: 'npm run seed:comments',
      description: 'Seeding comments',
    },
    {
      command: 'npm run seed:blogs',
      description: 'Seeding blogs',
    },
  ];

  for (const { command, description } of commands) {
    const success = await runCommand(command, description);
    if (!success && description !== 'Seeding comments' && description !== 'Seeding blogs') {
      console.error(`\n❌ Failed to seed ${description}. Stopping...`);
      process.exit(1);
    }
  }

  console.log('\n✅ All data seeded successfully!');
  process.exit(0);
}

seedAll();

