using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace Authentication.Common
{
    public class AuthOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Secret { get; set; }
        public int TokenLifetime { get; set; }
        public SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(this.Secret));
        }

        public static SymmetricSecurityKey GetSymmetricSecurityKey(string Secret)
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
        }
    }
}
