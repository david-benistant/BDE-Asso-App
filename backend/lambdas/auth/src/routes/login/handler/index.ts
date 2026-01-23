import { Handler } from "aws-lambda"
import AzureService from "../../../services/graph.service"
import propertiesService from "../../../services/properties.service"
import ApiError, { ApiErrorStatus } from "../../../services/errors.service"
import TokensService from "../../../services/tokens.service"
import UserRepository from "../../../repositories/users.repository"
import UserValueObject from "../../../valueObjects/users.valueObject"

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason)
})

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err)
})

export const handler: Handler = async (event) => {

  const AzureAccessToken = event.headers.authorization.replace("Bearer ", "").replace("Token ", "")

  const me = await AzureService.getMe(AzureAccessToken)

  const decodeAzureToken = TokensService.decodeAzureToken(AzureAccessToken)

  if (decodeAzureToken.appid !== propertiesService.getAzureClientId()) {
    throw new ApiError(401, ApiErrorStatus.UNAUTHORIZED, "Invalid Azure access token")
  }

  let userDomain = await UserRepository.getUserNoThrow(me.id)

  let user;
  if (userDomain) {
    user = new UserValueObject(userDomain)
  } else {
    user = new UserValueObject({id: me.id, email: me.mail, displayName: me.displayName})
    await UserRepository.putUser(user);
  }
  
  const accessToken = TokensService.generateAccessToken(user);

  return {
    statusCode: 200,
    body: JSON.stringify({ accessToken })
  }
}
