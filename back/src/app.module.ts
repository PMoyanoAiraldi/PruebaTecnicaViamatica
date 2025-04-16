import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { postgresDataSourceConfig } from './config/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { UsersModule } from './users/users.module';
import { RolModule } from './rol/rol.module';
import { RolOptionsModule } from './rol_options/rol_options.module';
import { RolUsersModule } from './rol_users/rol_users.module';
import { SessionsModule} from './sessions/sessions.module';
import { PersonModule } from './person/person.module';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menuItem/menu-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ postgresDataSourceConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory:  (configService: ConfigService): Promise<DataSourceOptions> => {
        const config = configService.get<DataSourceOptions>('postgres');
        if (!config) throw new Error('Postgres config not found');
        return Promise.resolve(config);;
      }
    }),
    UsersModule,
    RolModule,
    RolOptionsModule,
    RolUsersModule,
    SessionsModule,
    PersonModule, 
    AuthModule, 
    MenuModule

    
  ],
controllers: [AppController],
providers: [AppService],
exports: []
})

export class AppModule {}