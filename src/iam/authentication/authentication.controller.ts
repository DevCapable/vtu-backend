import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiEndpoint } from '@app/core/decorators';
import { ApiEndPoint } from '@app/core/interface/api-endpoint.interface';
import { AuthenticationService } from '@app/iam/authentication/authentication.service';
import { Public } from '@app/iam/decorators';
import { LocalAuthGuard } from '@app/iam/authentication/guards';
import { ApiOperation } from '@nestjs/swagger';

@Controller(ApiEndPoint.AUTH)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login as a user ' })
  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authenticationService.validateUser(
      body.email,
      body.password,
    );

    return this.authenticationService.login(user, body);
  }
}
