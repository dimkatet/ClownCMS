using Authentication.Auth.API.Models;
using Authentication.Common;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Authentication.Auth.API
{
    public class JWTGenerator
    {
        private IOptions<AuthOptions> authOptions;
        public JWTGenerator(IOptions<AuthOptions> authOprions)
        {
            this.authOptions = authOprions;
        }
        public string GenerateJWT(Account user)
        {
            var authParams = authOptions.Value;

            var securKay = AuthOptions.GetSymmetricSecurityKey(user.Secret);
            var credentials = new SigningCredentials(securKay, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Sub, user.AccountId.ToString())
            };

            var token = new JwtSecurityToken(authParams.Issuer,
                authParams.Audience,
                claims,
                expires: DateTime.Now.AddSeconds(authParams.TokenLifetime),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
