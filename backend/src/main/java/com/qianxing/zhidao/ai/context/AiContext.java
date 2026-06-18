package com.qianxing.zhidao.ai.context;

import java.util.List;
import java.util.Map;

/**
 * AI 统一上下文结构。
 * locationContext / weatherContext 当前 enabled=false，后续接入后启用。
 */
public class AiContext {
    private UserContext userContext = new UserContext();
    private TripContext tripContext = new TripContext();
    private LocationContext locationContext = new LocationContext();
    private WeatherContext weatherContext = new WeatherContext();
    private ContentContext contentContext = new ContentContext();

    public static class UserContext {
        private Long userId;
        private String nickname;
        private List<String> preferences;
        private String travelStyle;
        public Long getUserId() { return userId; }
        public void setUserId(Long v) { userId = v; }
        public String getNickname() { return nickname; }
        public void setNickname(String v) { nickname = v; }
        public List<String> getPreferences() { return preferences; }
        public void setPreferences(List<String> v) { preferences = v; }
        public String getTravelStyle() { return travelStyle; }
        public void setTravelStyle(String v) { travelStyle = v; }
    }

    public static class TripContext {
        private boolean hasActiveTrip;
        private Long tripId;
        private String routeTitle;
        private int currentDay;
        private List<String> todaySchedule;
        private List<String> completedSpots;
        private List<String> nextSpots;
        public boolean isHasActiveTrip() { return hasActiveTrip; }
        public void setHasActiveTrip(boolean v) { hasActiveTrip = v; }
        public Long getTripId() { return tripId; }
        public void setTripId(Long v) { tripId = v; }
        public String getRouteTitle() { return routeTitle; }
        public void setRouteTitle(String v) { routeTitle = v; }
        public int getCurrentDay() { return currentDay; }
        public void setCurrentDay(int v) { currentDay = v; }
        public List<String> getTodaySchedule() { return todaySchedule; }
        public void setTodaySchedule(List<String> v) { todaySchedule = v; }
        public List<String> getCompletedSpots() { return completedSpots; }
        public void setCompletedSpots(List<String> v) { completedSpots = v; }
        public List<String> getNextSpots() { return nextSpots; }
        public void setNextSpots(List<String> v) { nextSpots = v; }
    }

    public static class LocationContext {
        private boolean enabled;
        private String source = "none";
        private String city;
        private Long scenicId;
        private Double latitude;
        private Double longitude;
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean v) { enabled = v; }
        public String getSource() { return source; }
        public void setSource(String v) { source = v; }
        public String getCity() { return city; }
        public void setCity(String v) { city = v; }
        public Long getScenicId() { return scenicId; }
        public void setScenicId(Long v) { scenicId = v; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double v) { latitude = v; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double v) { longitude = v; }
    }

    public static class WeatherContext {
        private boolean enabled;
        private String provider;
        private String city;
        private String weatherText;
        private String temperature;
        private String wind;
        private String rainRisk;
        private String updatedAt;
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean v) { enabled = v; }
        public String getProvider() { return provider; }
        public void setProvider(String v) { provider = v; }
        public String getCity() { return city; }
        public void setCity(String v) { city = v; }
        public String getWeatherText() { return weatherText; }
        public void setWeatherText(String v) { weatherText = v; }
        public String getTemperature() { return temperature; }
        public void setTemperature(String v) { temperature = v; }
        public String getWind() { return wind; }
        public void setWind(String v) { wind = v; }
        public String getRainRisk() { return rainRisk; }
        public void setRainRisk(String v) { rainRisk = v; }
        public String getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(String v) { updatedAt = v; }
    }

    public static class ContentContext {
        private List<Map<String, Object>> scenicSpots;
        private List<Map<String, Object>> routes;
        public List<Map<String, Object>> getScenicSpots() { return scenicSpots; }
        public void setScenicSpots(List<Map<String, Object>> v) { scenicSpots = v; }
        public List<Map<String, Object>> getRoutes() { return routes; }
        public void setRoutes(List<Map<String, Object>> v) { routes = v; }
    }

    public UserContext getUserContext() { return userContext; }
    public TripContext getTripContext() { return tripContext; }
    public LocationContext getLocationContext() { return locationContext; }
    public WeatherContext getWeatherContext() { return weatherContext; }
    public ContentContext getContentContext() { return contentContext; }
}
