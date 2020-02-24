using Microsoft.AspNetCore.Components.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace mh_lret{
	public class Startup{
		public void ConfigureServices(IServiceCollection services){
			services.AddScoped<AppState>();
		}

		public void Configure(IComponentsApplicationBuilder app){
			app.AddComponent<App>("app");
		}
	}
}
