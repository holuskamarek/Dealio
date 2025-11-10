import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowsService } from './follows.service';

/**
 * FollowsController - API endpointy pro sledování podniků
 * 
 * TODO: Přidat endpoint pro seznam sledujících konkrétního podniku
 * TODO: Přidat endpoint pro statistiky sledování
 * FIXME: Přidat rate limiting pro follow/unfollow
 */
@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  /**
   * POST /follows/businesses/:businessId
   * Sledovat podnik
   */
  @Post('businesses/:businessId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async followBusiness(
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const follow = await this.followsService.followBusiness(userId, businessId);

    return {
      success: true,
      message: `Nyní sleduješ podnik s ID ${businessId}`,
      data: follow,
    };
  }

  /**
   * DELETE /follows/businesses/:businessId
   * Přestat sledovat podnik
   */
  @Delete('businesses/:businessId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unfollowBusiness(
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    await this.followsService.unfollowBusiness(userId, businessId);

    return {
      success: true,
      message: `Přestal jsi sledovat podnik s ID ${businessId}`,
    };
  }

  /**
   * GET /follows/me
   * Získat seznam sledovaných podniků aktuálního uživatele
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyFollows(@Request() req: any) {
    const userId = req.user.id;
    const follows = await this.followsService.getUserFollows(userId);

    return {
      success: true,
      message: 'Tvoje sledované podniky',
      data: follows,
      count: follows.length,
    };
  }

  /**
   * GET /follows/businesses/:businessId/followers
   * Získat počet sledujících pro podnik
   */
  @Get('businesses/:businessId/followers')
  @HttpCode(HttpStatus.OK)
  async getFollowersCount(@Param('businessId') businessId: string) {
    const count = await this.followsService.getFollowersCount(businessId);

    return {
      success: true,
      message: `Počet sledujících pro podnik ${businessId}`,
      data: {
        businessId,
        followersCount: count,
      },
    };
  }

  /**
   * GET /follows/businesses/:businessId/is-following
   * Zkontroluj, jestli aktuální uživatel sleduje podnik
   */
  @Get('businesses/:businessId/is-following')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async isFollowing(
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    const userId = req.user.id;
    const isFollowing = await this.followsService.isFollowing(
      userId,
      businessId,
    );

    return {
      success: true,
      data: {
        businessId,
        isFollowing,
      },
    };
  }
}

