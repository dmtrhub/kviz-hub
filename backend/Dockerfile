FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["Api/KvizHub.Api.csproj", "Api/"]
COPY ["Application/KvizHub.Application.csproj", "Application/"]
COPY ["Domain/KvizHub.Domain.csproj", "Domain/"]
COPY ["Infrastructure/KvizHub.Infrastructure.csproj", "Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Api/KvizHub.Api.csproj"

# Copy everything else including appsettings.json
COPY . .
WORKDIR "/src/Api"
RUN dotnet build "KvizHub.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "KvizHub.Api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=publish /src/Api/appsettings.json .

# FORSIRAJ DA SLUŠA NA PORTU 80
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "KvizHub.Api.dll"]