package com.qianxing.zhidao.weather.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("qx_weather_location")
public class QxWeatherLocation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String locationCode;
    private String locationName;
    private String locationType;
    private Long scenicSpotId;
    private String regionCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String providerCode;
    private Integer updateEnabled;
    private Integer updateIntervalMin;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
