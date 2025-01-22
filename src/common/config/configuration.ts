
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import 'dotenv/config';
import * as path from 'path';

// const YAML_CONFIG_FILENAME = `config.${process.env.env}.yaml`;
const YAML_CONFIG_FILENAME = `config.${process.env.ENV}.yaml`;
// const appDir = path.dirname(require.main.filename);
const rootDir = path.resolve(process.cwd(), 'src/common/config');

export function configuration() {
    const config = yaml.load(
        readFileSync(
            join(rootDir, YAML_CONFIG_FILENAME), 
            'utf8'
        ),
    ) as Record<string, any>;

    if (config.app.port < 1024 || config.app.port > 49151) {
        throw new Error('HTTP port must be');
    }

    return config;
};

// join(__dirname, `../config/${process.env.env}.yaml`)

